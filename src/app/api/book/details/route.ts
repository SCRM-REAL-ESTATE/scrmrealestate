import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";
import { clean, escapeHtml } from "@/lib/sanitise";
import { emailShell, table } from "@/lib/email";
import { getAddOn, getOffer, money, type Stream } from "@/lib/catalogue";
import { quote, totalLabel } from "@/lib/booking-rules";
import { DETAIL_QUESTIONS, labelFor } from "@/lib/booking-questions";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Stage two: the hot lead.
 *
 * The booking already exists — this is the optional half where they hand over
 * the address, the date and how we get in. Anyone who fills it in has told us
 * they're serious, so this email is the loud one, and it carries both halves so
 * it stands on its own in the inbox.
 *
 * Add-ons accepted here are priced from the catalogue by id. The browser never
 * sends an amount, and any total it thinks it knows is ignored.
 */

const FROM = process.env.CONTACT_FROM_EMAIL || "SCRM Media <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || SITE.email;

const STREAMS: Stream[] = ["residential", "commercial", "monthly"];

type DetailsPayload = {
  reference?: string;
  token?: string;
  stream?: string;
  answers?: Record<string, unknown>;
  extras?: string[];
  website?: string;
};

type StoredLine = { id: string; name: string; units: number; amount: number };

export async function POST(request: Request) {
  let body: DetailsPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (clean(body.website)) return NextResponse.json({ ok: true });

  const reference = clean(body.reference, 40);
  const token = clean(body.token, 80);
  if (!reference || !token) {
    return NextResponse.json({ error: "That link has expired. Please call us instead." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const record = db
    ? await db
        .from("bookings")
        .select("reference, token, stream, offer_id, offer_name, add_ons, name, email, phone, agency")
        .eq("reference", reference)
        .maybeSingle()
    : null;

  if (record?.error) console.error("Booking lookup failed:", record.error.message);

  const row = record?.data ?? null;

  // With a store we verify. Without one there is nothing to verify against, so
  // the honeypot and the shape checks are the whole defence — same posture the
  // contact form has always had.
  if (row && row.token !== token) {
    return NextResponse.json({ error: "That link doesn't match a booking." }, { status: 403 });
  }

  const streamCandidate = clean(body.stream, 20) as Stream;
  const stream: Stream =
    (row?.stream as Stream | undefined) ??
    (STREAMS.includes(streamCandidate) ? streamCandidate : "residential");

  // Only questions we actually asked, only values we're willing to print.
  const known = new Set(DETAIL_QUESTIONS[stream].map((q) => q.id));
  const answers: Record<string, string> = {};
  if (body.answers && typeof body.answers === "object") {
    for (const [key, value] of Object.entries(body.answers)) {
      const id = clean(key, 40);
      const text = clean(value, 2000);
      if (known.has(id) && text) answers[id] = text;
    }
  }

  const extras = (Array.isArray(body.extras) ? body.extras : [])
    .map((id) => clean(id, 80))
    .filter((id) => Boolean(getAddOn(id)))
    .slice(0, 10);

  if (!Object.keys(answers).length && !extras.length) {
    return NextResponse.json({ error: "Nothing to send yet — answer a question first." }, { status: 400 });
  }

  const offer = getOffer(row?.offer_id ?? undefined);
  const storedLines: StoredLine[] = Array.isArray(row?.add_ons) ? (row.add_ons as StoredLine[]) : [];

  // Re-price the whole order from ids: the original add-ons plus anything
  // accepted just now.
  const quantities: Record<string, number> = {};
  storedLines.forEach((l) => {
    if (l?.id) quantities[l.id] = l.units ?? 1;
  });
  const q = offer
    ? quote(offer.id, [...storedLines.map((l) => l.id).filter(Boolean), ...extras], quantities)
    : null;

  const extrasTotal = extras.reduce((sum, id) => sum + (getAddOn(id)?.amount ?? 0), 0);

  await persist(reference, { answers, extras, total: q && !q.quoteOnly ? q.total : null });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — booking details could not be delivered.", reference);
    return NextResponse.json(
      { error: `We couldn't send that just now. Please call us on ${SITE.phone}.` },
      { status: 503 }
    );
  }

  const headline = answers.address || row?.name || reference;

  const orderRows: [string, string][] = [
    ["Reference", reference] as [string, string],
    ...(offer ? ([["Package", offer.name]] as [string, string][]) : []),
    ...(q ? q.lines.map((l): [string, string] => [l.name + (l.units > 1 ? ` ×${l.units}` : ""), money(l.amount)]) : []),
    ...(q ? ([["Total", totalLabel(q)]] as [string, string][]) : []),
    ...(row
      ? ([
          ["Name", row.name as string],
          ["Agency", (row.agency as string) ?? ""],
          ["Email", row.email as string],
          ["Phone", row.phone as string],
        ] as [string, string][])
      : []),
  ].filter(([, v]) => v);

  const answerRows: [string, string][] = DETAIL_QUESTIONS[stream]
    .filter((question) => answers[question.id])
    .map((question): [string, string] => [labelFor(stream, question.id), answers[question.id]]);

  const addedRows: [string, string][] = extras.map((id): [string, string] => [
    `Added at this step: ${getAddOn(id)?.name ?? id}`,
    money(getAddOn(id)?.amount ?? 0),
  ]);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: (row?.email as string) || TO,
      subject: `🔥 HOT LEAD — ${q && !q.quoteOnly ? `${totalLabel(q)} — ` : ""}${headline}`,
      text: [
        "They filled in the property details. This one is ready to schedule.",
        "",
        ...orderRows.map(([k, v]) => `${k}: ${v}`),
        "",
        ...answerRows.map(([k, v]) => `${k}: ${v}`),
        ...(addedRows.length ? ["", ...addedRows.map(([k, v]) => `${k}: ${v}`)] : []),
        ...(extrasTotal ? ["", `Extras added at this step: ${money(extrasTotal)}`] : []),
      ].join("\n"),
      html: emailShell(
        "🔥 Hot lead — property details supplied",
        `<p style="margin:0 0 18px;padding:12px 16px;background:#EAF2FF;border-left:3px solid #1E62E0;border-radius:8px;color:#1a1a1a">They filled in the property details, so this one is ready to schedule rather than chase.</p>`,
        table(orderRows),
        answerRows.length
          ? `<h3 style="margin:24px 0 10px;font-size:15px">What they told us</h3>${table(answerRows)}`
          : "",
        addedRows.length
          ? `<h3 style="margin:24px 0 10px;font-size:15px;color:#1E62E0">Added at this step</h3>${table(
              addedRows
            )}`
          : "",
        row
          ? ""
          : `<p style="margin:18px 0 0;color:#9e4a32">Couldn't match this to a stored booking — reference ${escapeHtml(
              reference
            )} came from the browser unverified.</p>`
      ),
    });

    if (error) {
      console.error("Resend rejected the booking details:", error);
      return NextResponse.json(
        { error: `We couldn't send that just now. Please call us on ${SITE.phone}.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sending the booking details failed:", err);
    return NextResponse.json(
      { error: `We couldn't send that just now. Please call us on ${SITE.phone}.` },
      { status: 502 }
    );
  }
}

/** Best-effort, like stage one. The email is what matters. */
async function persist(
  reference: string,
  patch: { answers: Record<string, string>; extras: string[]; total: number | null }
) {
  const db = supabaseAdmin();
  if (!db) return;
  const { error } = await db
    .from("bookings")
    .update({
      details: patch.answers,
      extra_add_ons: patch.extras,
      ...(patch.total !== null ? { total_aud: patch.total } : {}),
      status: "qualified",
      qualified_at: new Date().toISOString(),
    })
    .eq("reference", reference);
  if (error) console.error("Booking details not stored:", error.message);
}
