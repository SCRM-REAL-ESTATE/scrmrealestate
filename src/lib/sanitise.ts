/**
 * Input hygiene shared by every form endpoint. Was inline in api/contact until
 * the booking routes needed exactly the same two functions.
 */

/** Trim, cap the length, and refuse anything that isn't a string. */
export const clean = (value: unknown, max = 2000): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
