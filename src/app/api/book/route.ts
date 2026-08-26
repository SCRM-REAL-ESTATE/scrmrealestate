import { randomBytes, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";
import { clean, escapeHtml, isEmail } from "@/lib/sanitise";
import { getOffer, money } from "@/lib/catalogue";
import { quote, totalLabel } from "@/lib/booking-rules";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { emailShell, table } from "@/lib/email";

/**
 * The booking itself: address, package, extras, when they want it, who to call.
 *
 * Everything needed to put a shoot in the diary arrives in one request. What
 * doesn't arrive here is the operational detail — who lets us in, whether the
 * place is empty, what the close date is — which /api/book/details collects
 * afterwards and sends as the second, louder email. Splitting it that way keeps
 * the booking itself down to four steps without losing the answers that stop us
 * having to ring twice.
 *
 * The total is recomputed here from the catalogue. The browser sends ids, never
 * prices: the number in the email has to be one we'd honour.
 */

const FROM = process.env.CONTACT_FROM_EMAIL || "SCRM Media <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || SITE.email;

/** No I, L, O, 0 or 1 — these get read down the phone. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const reference = () =>
  "SCRM-" +
  Array.from(randomBytes(5))
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");

export type BookPayload = {
  offerId?: string;
  addOns?: string[];
  quantities?: Record<string, number>;
  address?: string;
  /** "As soon as possible", "Tomorrow", or an ISO date they picked. */
  when?: string;
  timeSlot?: string;
  notes?: string;
  name?: string;
  email?: string;
  phone?: string;
  agency?: string;
  website?: string;
};

export async function POST(request: Request) {
  let body: BookPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Bots get a plausible success rather than an explanation.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true, reference: reference(), token: randomUUID() });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const agency = clean(body.agency, 160);
  const address = clean(body.address, 240);
  const when = clean(body.when, 60);
  const timeSlot = clean(body.timeSlot, 40);
  const notes = clean(body.notes, 4000);

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Please add your name, email and phone so we can call you back." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const offer = getOffer(clean(body.offerId, 80));
  if (!offer) {
    return NextResponse.json({ error: "Please choose a package first." }, { status: 400 });
  }

  const requested = Array.isArray(body.addOns)
    ? body.addOns.map((id) => clean(id, 80)).filter(Boolean).slice(0, 20)
    : [];
  const quantities: Record<string, number> = {};
  if (body.quantities && typeof body.quantities === "object") {
    for (const [id, units] of Object.entries(body.quantities)) {
      if (typeof units === "number" && Number.isFinite(units)) quantities[clean(id, 80)] = units;
    }
  }

  // The catalogue decides what this costs, not the browser.
  const q = quote(offer.id, requested, quantities);
  const ref = reference();
  const token = randomUUID();

  const stored = await storeBooking({
    reference: ref,
    token,
    stream: offer.stream,
    offer_id: offer.id,
    offer_name: offer.name,
    add_ons: q.lines,
    total_aud: q.quoteOnly ? null : q.total,
    address: address || null,
    preferred_when: when || null,
    preferred_time: timeSlot || null,
    notes: notes || null,
    name,
    email,
    phone,
    agency: agency || null,
  });

  const resumeUrl = `${SITE.url}/book/details?ref=${encodeURIComponent(ref)}&t=${encodeURIComponent(
    token
  )}&stream=${offer.stream}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — booking could not be delivered.", ref);
    return NextResponse.json(
      { error: `Our booking form is temporarily unavailable. Please call us on ${SITE.phone}.` },
      { status: 503 }
    );
  }

  const lineRows: [string, string][] = [
    ["Reference", ref],
    ["Address", address],
    ["Preferred", [when, timeSlot].filter(Boolean).join(" · ")],
    ["Package", `${offer.name}${q.quoteOnly ? " (quote)" : ` — ${offer.price}`}`],
    ...q.lines.map(
      (l): [string, string] => [
        l.name + (l.units > 1 ? ` ×${l.units}` : ""),
        money(l.amount),
      ]
    ),
    ...(q.saved > 0 ? ([["Bundled saving", `−${money(q.saved)}`]] as [string, string][]) : []),
    ["Total", totalLabel(q)],
    ["Name", name],
    ["Agency", agency],
    ["Email", email],
    ["Phone", phone],
    ["Notes", notes],
  ].filter(([, v]) => v) as [string, string][];

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `New booking — ${address || name} — ${offer.name}, ${totalLabel(q)}`,
      text: [
        ...lineRows.map(([k, v]) => `${k}: ${v}`),
        "",
        "Access and property details not supplied yet — they were invited to add them straight after booking.",
        stored ? "" : "NOTE: not written to the bookings table (store not configured).",
      ]
        .filter(Boolean)
        .join("\n"),
      html: emailShell(
        "New booking request",
        table(lineRows),
        `<p style="margin:18px 0 0;color:#514d46">Access and property details not supplied yet — they were invited to add them straight after booking. A second email lands if they do.</p>${
          stored
            ? ""
            : `<p style="margin:10px 0 0;color:#9e4a32">Not written to the bookings table — the store isn't configured.</p>`
        }`
      ),
    });

    if (error) {
      console.error("Resend rejected the booking:", error);
      return NextResponse.json(
        { error: `We couldn't send that just now. Please call us on ${SITE.phone}.` },
        { status: 502 }
      );
    }

    // Confirmation to the customer, carrying the link back into stage two.
    await resend.emails
      .send({
        from: FROM,
        to: [email],
        replyTo: TO,
        subject: `We've got your booking — ${ref}`,
        text: [
          `Thanks ${name.split(" ")[0]}, your request is in.`,
          "",
          address,
          `${offer.name}${q.quoteOnly ? "" : ` — ${totalLabel(q)}`}`,
          ...q.lines.map((l) => `+ ${l.name}${l.units > 1 ? ` ×${l.units}` : ""} ${money(l.amount)}`),
          "",
          "We'll call within one business day to lock in a time.",
          "",
          "Save us a phone call — tell us about access and the property here:",
          resumeUrl,
          "",
          `Reference ${ref} · ${SITE.phone}`,
        ].join("\n"),
        html: emailShell(
          "Your booking request is in",
          `<p style="margin:0 0 18px;color:#514d46">Thanks ${escapeHtml(
            name.split(" ")[0]
          )} — we'll call within one business day to lock in a time.</p>` +
            table([
              ["Reference", ref],
              ["Address", address],
              ["Requested", [when, timeSlot].filter(Boolean).join(" · ")],
              ["Package", offer.name],
              ...q.lines.map(
                (l): [string, string] => [
                  l.name + (l.units > 1 ? ` ×${l.units}` : ""),
                  money(l.amount),
                ]
              ),
              ["Total", totalLabel(q)],
            ]),
          `<p style="margin:22px 0 8px;color:#1a1a1a"><strong>Save us a phone call</strong></p>
           <p style="margin:0 0 16px;color:#514d46">Tell us who lets us in and a couple of things about the property, and the call becomes about confirming a time rather than gathering information.</p>
           <p style="margin:0"><a href="${resumeUrl}" style="display:inline-block;background:#1E62E0;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px">Add the details</a></p>
           <p style="margin:20px 0 0;color:#514d46;font-size:13px">Or call us on ${SITE.phone} and quote ${ref}.</p>`
        ),
      })
      .catch((err) => console.error("Customer confirmation failed:", err));

    return NextResponse.json({ ok: true, reference: ref, token });
  } catch (err) {
    console.error("Sending the booking failed:", err);
    return NextResponse.json(
      { error: `We couldn't send that just now. Please call us on ${SITE.phone}.` },
      { status: 502 }
    );
  }
}

/** Storage is best-effort: an emailed booking is never failed over a database. */
async function storeBooking(row: Record<string, unknown>): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return false;
  const { error } = await db.from("bookings").insert(row);
  if (error) {
    console.error("Booking not stored:", error.message);
    return false;
  }
  return true;
}

