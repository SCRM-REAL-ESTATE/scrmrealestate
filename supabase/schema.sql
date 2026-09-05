-- Run this in the Supabase SQL editor.
--
-- LEGACY, not applied to the live database: contact_submissions below is no
-- longer written to by anything. The contact form used to insert straight from
-- the browser with the anon key, which silently discarded every enquiry
-- whenever the keys weren't configured. It now posts to /api/contact and is
-- delivered as email instead. Kept for reference only. Don't create it: the
-- permissive anon INSERT policy is public write access to a table nothing
-- reads.
--
-- The live schema is `bookings`, further down.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  agency text,
  message text not null,
  services text[] default '{}'::text[],
  user_agent text,
  ip text
);

alter table public.contact_submissions enable row level security;

-- Allow the public anon key to INSERT (the form submits from the browser).
drop policy if exists "Public can insert contact submissions" on public.contact_submissions;
create policy "Public can insert contact submissions"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- No SELECT policy is added — submissions are read by you in the Supabase dashboard
-- (which uses the service_role key and bypasses RLS).

-- Helpful index for browsing recent submissions:
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);


-- ─────────────────────────────────────────────────────────────────────────────
-- Bookings (src/app/book) — the funnel writes these from the server only.
--
-- Unlike contact_submissions there is deliberately NO anon policy: the browser
-- never touches this table. /api/book inserts with the secret key, which means
-- the total in a row is one the server computed from the catalogue rather than
-- one a page sent it.
--
-- status walks lead → qualified → confirmed → shot → delivered. A row lands as
-- 'lead' the moment someone gives us a name and a number, and flips to
-- 'qualified' if they go on to give us the address and the rest.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Short, unambiguous, and readable down the phone (no I, L, O, 0 or 1).
  reference text not null unique,
  -- Returned to the browser once, so the second half of the funnel can attach
  -- to this row and no other.
  token uuid not null,

  stream text not null check (stream in ('residential', 'commercial', 'monthly')),
  offer_id text,
  offer_name text,
  add_ons jsonb not null default '[]'::jsonb,
  extra_add_ons jsonb not null default '[]'::jsonb,
  total_aud integer,

  -- Taken in the funnel itself: the address is how a shoot is identified, and
  -- the preference is what the confirming call is actually about.
  address text,
  preferred_when text,
  preferred_time text,
  notes text,

  name text not null,
  email text not null,
  phone text,
  agency text,

  -- The operational half, asked once the booking is already safe: access,
  -- occupancy, close date, NDA. Shape varies by stream, so it's stored as the
  -- answers keyed by question id.
  details jsonb,
  qualified_at timestamptz,

  status text not null default 'lead'
    check (status in ('lead', 'qualified', 'confirmed', 'shot', 'delivered', 'cancelled'))
);

alter table public.bookings enable row level security;

-- No policies at all. The anon key can neither read nor write; the service key
-- used by the route handlers bypasses RLS.

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

-- Safe to re-run over an earlier version of this table.
alter table if exists public.bookings add column if not exists address text;
alter table if exists public.bookings add column if not exists preferred_when text;
alter table if exists public.bookings add column if not exists preferred_time text;
alter table if exists public.bookings add column if not exists notes text;
