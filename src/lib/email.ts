import { escapeHtml } from "./sanitise";
import { SITE } from "./site";

/** Shared markup for the transactional emails, so they read as one sender. */

/**
 * Resend's shared sandbox sender. It only delivers to the address that owns the
 * Resend account, so left in place it rejects every real enquiry and booking —
 * which looks from the outside exactly like "the form is broken". Sending for
 * real needs a verified domain and CONTACT_FROM_EMAIL set to an address on it.
 */
export const SANDBOX_FROM = "SCRM Media <onboarding@resend.dev>";

export const MAIL_FROM = process.env.CONTACT_FROM_EMAIL || SANDBOX_FROM;
export const MAIL_TO = process.env.CONTACT_TO_EMAIL || SITE.email;

/**
 * Why Resend refused, in one line the platform log can actually render. The
 * bare error object comes out as "[object Object]", which tells nobody
 * anything at the point they most need to know.
 */
export function logSendFailure(what: string, error: { name?: string; message?: string }) {
  console.error(
    `Resend rejected the ${what} [${error.name ?? "unknown"}]: ${
      error.message ?? "no message"
    } (from: ${MAIL_FROM}, to: ${MAIL_TO})`
  );
  if (MAIL_FROM === SANDBOX_FROM) {
    console.error(
      "CONTACT_FROM_EMAIL is unset, so this sent from Resend's sandbox address, " +
        "which only delivers to the Resend account owner. Verify a domain at " +
        "resend.com/domains and set CONTACT_FROM_EMAIL to an address on it."
    );
  }
}

export function table(rows: [string, string][]): string {
  return `<table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:5px 18px 5px 0;color:#514d46;vertical-align:top">${escapeHtml(
          k
        )}</td><td style="padding:5px 0"><strong>${escapeHtml(v)}</strong></td></tr>`
    )
    .join("")}</table>`;
}

export function emailShell(heading: string, ...blocks: string[]): string {
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a1a;line-height:1.6;max-width:560px">
      <h2 style="margin:0 0 18px;font-size:19px">${escapeHtml(heading)}</h2>
      ${blocks.join("")}
    </div>
  `;
}
