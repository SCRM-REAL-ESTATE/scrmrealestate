import { escapeHtml } from "./sanitise";

/** Shared markup for the transactional emails, so they read as one sender. */

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
