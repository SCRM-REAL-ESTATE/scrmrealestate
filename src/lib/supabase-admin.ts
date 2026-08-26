import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, used by the booking routes to write the
 * `bookings` table.
 *
 * The secret key bypasses row-level security, so this module must never be
 * imported from a client component — nothing here is NEXT_PUBLIC_ and Next
 * will fail the build if it ends up in a browser bundle, which is the point.
 *
 * Returns null when the key isn't configured. Every caller treats storage as
 * optional: a booking that emailed successfully is not going to be failed
 * because a database was unreachable.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export const isBookingStoreConfigured = (): boolean => supabaseAdmin() !== null;
