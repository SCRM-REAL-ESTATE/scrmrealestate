import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

/**
 * Enquiries from the contact form land in the inbox as email.
 *
 * The key lives on the server only. The browser posts here, this route talks
 * to Resend, so the API key is never shipped to the page. If the key is
 * missing the route says so plainly rather than accepting the message and
 * dropping it, which is what the old client-side path did.
 */

const FROM = process.env.CONTACT_FROM_EMAIL || "SCRM Media <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || SITE.email;

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  agency?: string;
  message?: string;
  services?: string[];
  /** Hidden field. Real people leave it empty; bots fill everything in. */
  website?: string;
};

const clean = (value: unknown, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Silently accept and discard bot submissions: telling them why helps them.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const agency = clean(body.agency, 160);
  const message = clean(body.message, 5000);
  const services = Array.isArray(body.services)
    ? body.services.map((s) => clean(s, 80)).filter(Boolean).slice(0, 12)
    : [];

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and a short message." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — enquiry could not be delivered.");
    return NextResponse.json(
      { error: "Our contact form is temporarily unavailable. Please email or call us instead." },
      { status: 503 }
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Agency", agency],
    ["Email", email],
    ["Phone", phone],
    ["Interested in", services.join(", ")],
  ].filter(([, v]) => v) as [string, string][];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a1a;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">New enquiry from the website</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#514d46">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
          )
          .join("")}
      </table>
      <div style="padding:16px;background:#eaf2ff;border-radius:12px;white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `New enquiry: ${name}${agency ? ` (${agency})` : ""}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend rejected the enquiry:", error);
      return NextResponse.json(
        { error: "We couldn't send that just now. Please try again, or email us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sending the enquiry failed:", err);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please try again, or email us directly." },
      { status: 502 }
    );
  }
}
