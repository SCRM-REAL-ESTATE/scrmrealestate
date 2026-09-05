import { escapeHtml } from "./sanitise";
import { SITE } from "./site";

/** Shared markup for the transactional emails, so they read as one sender. */

/**
 * Who the transactional email comes from.
 *
 * scrmrealestate.com.au is verified in Resend, so this is a default in code
 * rather than an environment variable: a sender identity is public, it can't
 * change without the domain changing, and hosting-dashboard access shouldn't
 * be what stands between a working form and a broken one. The env var still
 * wins if it's set, which is what moving to a different domain would use.
 *
 * It MUST stay on a Resend-verified domain. Resend refuses anything else, and
 * the refusal looks from the outside exactly like "the form is broken".
 */
export const MAIL_FROM =
  process.env.CONTACT_FROM_EMAIL || "SCRM Media <noreply@scrmrealestate.com.au>";

/** Where enquiries land. Recipients need no verification, unlike senders. */
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
