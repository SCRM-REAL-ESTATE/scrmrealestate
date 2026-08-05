# SCRM Media Real Estate

Marketing site for **SCRM Media Real Estate** — a premium content and marketing studio for luxury real estate agencies, top-performing agents, and boutique developers across Australia.

Built with **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS** · **Supabase** · deployed on **Vercel**.

---

## Local development

```bash
# 1. install dependencies
npm install

# 2. copy env template and fill in your Supabase keys
cp .env.example .env.local

# 3. start the dev server
npm run dev
```

Site runs on `http://localhost:3000`.

If you skip the Supabase step, the contact form will still work locally — submissions are logged to the browser console instead of being saved.

---

## Project structure

```
public/
  logo.png                  ← drop your logo here (replaces text logo)
  og.jpg                    ← 1200x630 OG image for social shares
  media/
    listings/               ← listing photography (PNG)
media-src/                  ← drop new photos/videos here, then `npm run media`
src/
  data/
    media.json              ← generated gallery list — never edit by hand
  app/
    layout.tsx              ← root shell, metadata, JSON-LD
    page.tsx                ← Home
    services/page.tsx       ← services + pricing (packages folded in)
    work/page.tsx
    about/page.tsx
    contact/page.tsx
  components/
    Header.tsx              ← desktop nav + mobile drawer
    TopBar.tsx              ← cross-brand strip with Automotive button
    Footer.tsx              ← 4-col footer
    WhatsAppFab.tsx         ← floating WhatsApp button
    GlitchTransition.tsx    ← CRT glitch animation when Automotive clicked
    Logo.tsx                ← text-based logo placeholder
    ContactForm.tsx         ← Supabase-wired enquiry form
    WorkGallery.tsx         ← filterable gallery, video-first
    ServiceIncludes.tsx     ← deliverables that open their own examples
    FAQAccordion.tsx
    ui.tsx                  ← Container, Section, CTAButton, Eyebrow, H2
  lib/
    site.ts                 ← brand constants (phone, email, URLs)
    media.ts                ← reads media.json, resolves CDN URLs
    supabase.ts             ← Supabase client (no-op when env missing)
scripts/
  setup.sh                  ← `npm run setup` — one-time machine setup
  sync-media.mjs            ← `npm run media` — compress, upload, regenerate
supabase/
  schema.sql                ← run once in the Supabase SQL editor
```

---

## Adding photos and videos

Everything in the Work gallery comes from `src/data/media.json`, which is generated — you never edit it by hand. One command compresses your files, uploads them to Supabase Storage, and rewrites that list.

**Setup, once:**

```bash
npm run setup
```

Checks Node, installs dependencies, offers to install ffmpeg via Homebrew, asks for your Supabase keys, creates the drop folder and opens it in Finder. Safe to re-run — anything already done is skipped.

Doing it by hand instead:

1. Install ffmpeg — macOS `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`.
2. Add your Supabase service role key to `.env.local` (**Project Settings → API**):

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```

   This key bypasses every security rule — it lives in `.env.local` only. Never in Vercel, never committed.

**Every time you have new work:**

1. Drop the files into `media-src/`, using the folder that matches where they should appear:

   | Folder | Holds | Gallery filter |
   | ------ | ----- | -------------- |
   | `media-src/property/` | photos | Listing Photography |
   | `media-src/vertical/` | 9:16 video | Vertical Video |
   | `media-src/landscape/` | 16:9 video | Listing Video |
   | `media-src/carousels/` | photos | Carousel Posts |
   | `media-src/detail/` | photos or video | Stories & Detail |
   | `media-src/testimonials/` | photos or video | Testimonials |
   | `media-src/agency/` | photos or video | Brand & Team |

   The last four accept photos and video together, so a folder of mixed story
   content can go in as-is. (`media-src/listings/` still works as an alias for
   `property/`.)

   Raw camera exports are fine — files are compressed before upload. Filenames are tidied automatically (`My Reel 01.MOV` → `my-reel-01.mp4`), so name them however you like. iPhone `.HEIC` photos are the one exception: export them as JPG first.

2. Run it:

   ```bash
   npm run media
   ```

3. Commit the regenerated `src/data/media.json`. The new work is live on the next deploy.

Two things happen automatically as categories fill up: the Work gallery grows a filter button for each category that has work in it, and the "see examples" links on the Services page start working — `8 social media videos per month` opens the vertical reels, `6 posts` opens the carousels, `6 stories` opens the detail shots. A category with nothing in it stays hidden rather than showing an empty state.

Adding is additive — a run only ever adds or updates what you supplied, so you can empty `media-src/` between batches without losing anything already published. To **remove** work, delete the file from Supabase Storage and re-run with `--replace`, which rebuilds the folders you supplied files for.

Other flags: `--dry-run` (preview, changes nothing), `--force` (re-compress and re-upload everything), `--no-upload` (work offline), `--only=vertical` (limit to one folder).

Finally, the site needs to know where the bucket lives. Set this in Vercel once:

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://xxxxx.supabase.co/storage/v1/object/public/media
```

---

## Supabase setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql) — this creates the `contact_submissions` table with row-level security and a public-insert policy.
3. From **Project Settings → API**, copy the **Project URL** and the **anon public key**.
4. Add both to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=https://scrmrealestate.com.au
```

5. Submissions appear in **Table Editor → contact_submissions** in the Supabase dashboard.

---

## Deploying to Vercel

1. Push this folder to a GitHub repo (`scrmrealestate` recommended).
2. In Vercel: **Add New → Project → Import** that repo.
3. Framework will be auto-detected as Next.js.
4. Add the three env vars from above under **Environment Variables**.
5. Deploy.
6. Once your domain `scrmrealestate.com.au` is registered, add it under **Project Settings → Domains** and follow the DNS instructions.

Subsequent pushes to `main` will auto-deploy.

---

## Brand tokens

| Token             | Hex      | Use                                    |
| ----------------- | -------- | -------------------------------------- |
| `re-blue`         | #1C3A5E  | Primary brand, headers, dark sections  |
| `re-ivory`        | #F8F6F1  | Page background                        |
| `re-ink`          | #1A1A1A  | Body text                              |
| `re-stone`        | #8A8680  | Secondary text                         |
| `re-stone-light`  | #E8E5DF  | Borders, dividers                      |
| `re-blue-accent`  | #3B6FAA  | Labels, highlights                     |
| `re-blue-light`   | #EDF2F8  | Info panels                            |
| `re-gold-thin`    | #C4A96C  | Accent moments (badges)                |

Fonts: **Cormorant Garamond** (display) and **Inter** (everything else), both loaded via `next/font/google`.

---

## Replacing the placeholder logo

The current logo is a text/SVG render of "scrm media — REAL ESTATE" in `src/components/Logo.tsx`.

To use the proper PNG/SVG you sent:

1. Drop the file into `public/logo.png` (transparent or black background).
2. Replace the body of `Logo.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="SCRM Media Real Estate — Home" className="inline-flex">
      <Image
        src="/logo.png"
        alt="SCRM Media Real Estate"
        width={180}
        height={48}
        priority
        className={variant === "light" ? "" : ""}
      />
    </Link>
  );
}
```

(If the logo only works on a dark background, the placeholder text version is currently safer for the white header.)

---

## What's still placeholder content

- **Logo** — text-rendered until `public/logo.png` is added.
- **OG image** (`/og.jpg`) — drop a 1200×630 export of your hero.
- **Testimonials** — generic copy, swap with real client quotes.
- **Trust bar stats (35+, 1.5M+, $14)** — used as you described, update when figures change.
- **Social links** — Instagram and LinkedIn URLs in `src/lib/site.ts` are guesses.

---

## Useful scripts

```bash
npm run dev      # local dev server
npm run build    # production build (also runs type-check + lint)
npm run start    # serve the built output
npm run lint     # lint only
npm run setup    # one-time: deps, ffmpeg, keys, drop folder
npm run media    # compress + publish every photo and video (see below)
```
