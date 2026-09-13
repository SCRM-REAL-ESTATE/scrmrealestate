import type { Metadata } from "next";
import Image from "next/image";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ListingPhotoGrid from "@/components/ListingPhotoGrid";
import { LISTING_PACKAGES } from "@/lib/pricing";
import { MEDIA_ITEMS, mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";

/**
 * Paid-traffic landing page for the Signature package.
 *
 * Ads point here, so it answers the only three questions a cold visitor has —
 * what does it cost, what do I get, what does that look like — and then asks
 * for the booking. Deliberately no navigation detours, no philosophy and no
 * second offer: every section either shows the work or books it.
 *
 * Kept to one screen of pitch and one of proof. The header carries no media of
 * its own so the price is the first and largest thing on the page.
 */

const SIGNATURE = LISTING_PACKAGES.find((p) => p.id === "pkg-signature")!;

export const metadata: Metadata = {
  title: `Listing photography, floor plan and video from ${SIGNATURE.price}`,
  description: `${SIGNATURE.price} per listing. ${SIGNATURE.products}, delivered next business day: professionally edited photos, a 2D colour floor plan, a landscape listing video and a vertical agent-led video with you on camera.`,
  alternates: { canonical: "/signature" },
};

const BOOK = `/book?p=${SIGNATURE.id}`;

/**
 * The full delivered set for one listing rather than a selection: the offer is
 * a count, so the count is shown instead of claimed.
 */
const LISTING_PHOTOS = Array.from(
  { length: 18 },
  (_, i) => `/media/examples/listing/${String(i + 1).padStart(2, "0")}.jpg`
);

const verticalVideo = MEDIA_ITEMS.find((i) => i.src === "vertical/vertical-3-bed.mp4");

/**
 * The finished listing video, embedded from Drive rather than served from our
 * own storage.
 *
 * STOPGAP. The master is 4K and too large to pull into the repo from here, so
 * the visitor's browser fetches it from Google instead. That costs us the
 * player chrome and leaves the file subject to Drive's view throttling under
 * heavy traffic, which an ad campaign can provoke. Replace with an entry in
 * media.json once `npm run media` has published a web-sized encode, and this
 * whole block becomes a <video> like the one above it.
 */
const LISTING_VIDEO_DRIVE_ID = "1wh3vLEaHV4xk93ahHdPohC3OzcBBcnfd";

export default function SignaturePage() {
  return (
    <>
      {/* ── PRICE ─────────────────────────────────────────────────────────── */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          <Container className="relative py-10 md:py-14">
            <Reveal direction="up">
              <p className="label-eyebrow !text-white/75">Listing package</p>
              <h1 className="mt-3 h-display text-4xl sm:text-5xl md:text-6xl text-white max-w-3xl">
                Your next listing, shot properly.
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-serif text-5xl md:text-6xl text-white">{SIGNATURE.price}</span>
                <span className="text-white/75">per listing</span>
              </div>

              <p className="mt-4 max-w-xl text-lg text-white/85 leading-relaxed">
                Photos, a listing video, a floor plan and a vertical video with you on camera.
                {" "}{SIGNATURE.products}, back {SIGNATURE.turnaround.toLowerCase()}.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CTAButton href={BOOK} variant="white">
                  Book this listing
                </CTAButton>
                <CTAButton href={`tel:${SITE.phoneIntl}`} variant="outline-light" external>
                  {SITE.phone}
                </CTAButton>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                {["No contract", "No lock-in", "Book per listing"].map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span aria-hidden className="text-re-gold-thin">◆</span>
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────── */}
      <Section panel="white">
        <Container>
          <Reveal>
            <H2 rule>What you get.</H2>
          </Reveal>

          <div className="mt-10 space-y-12 md:space-y-16">
            {/* Photos — the whole set, openable */}
            <Reveal>
              <div>
                <div className="max-w-2xl">
                  <p className="label-eyebrow">01</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    18 professionally edited photos
                  </h3>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Shot on DSLR and edited by hand. A whole set, exactly as it lands in your
                    inbox. Tap any photo to look through them.
                  </p>
                </div>
                <ListingPhotoGrid photos={LISTING_PHOTOS} />
              </div>
            </Reveal>

            {/* Listing video */}
            <Reveal>
              <div>
                <div className="max-w-2xl">
                  <p className="label-eyebrow">02</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    Landscape listing video
                  </h3>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    A walkthrough of the property, cut for the listing and for your socials.
                  </p>
                  {/* The example was shot with aerial. Saying so stops the package
                      reading as though drone is included at this price. */}
                  <p className="mt-4 rounded-2xl bg-re-blue-light px-5 py-4 text-sm leading-relaxed text-re-ink">
                    This example includes drone shots. Aerial is an optional extra and is not
                    included in the {SIGNATURE.price} package.
                  </p>
                </div>
                <div className="relative mt-6 w-full aspect-video overflow-hidden rounded-2xl bg-re-stone-light">
                  <iframe
                    src={`https://drive.google.com/file/d/${LISTING_VIDEO_DRIVE_ID}/preview`}
                    title="Landscape listing video"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            </Reveal>

            {/* Both of these are portrait, so they pair into one row rather than
                taking a full-width band each. */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
                <div>
                  <p className="label-eyebrow">03</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    2D colour floor plan
                  </h3>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Every room measured and labelled, with the total area at the bottom.
                  </p>
                  <div className="mt-6 rounded-2xl border border-re-stone-light bg-white p-4">
                    <Image
                      src="/media/examples/floor-plan.jpg"
                      alt="2D colour floor plan with room dimensions and total area"
                      width={1600}
                      height={2204}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="block w-full h-auto"
                    />
                  </div>
                </div>

                {verticalVideo && (
                  <div>
                    <p className="label-eyebrow">04</p>
                    <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                      Vertical agent-led video
                    </h3>
                    <p className="mt-3 text-re-stone leading-relaxed">
                      You on camera at the property, branded to you and cut for Reels and
                      TikTok. The listing sells the property. This sells you.
                    </p>
                    <div className="relative mt-6 mx-auto w-full max-w-[300px] aspect-[9/16] overflow-hidden rounded-2xl bg-re-stone-light">
                      <video
                        src={mediaUrl(verticalVideo.src)}
                        poster={verticalVideo.poster ? mediaUrl(verticalVideo.poster) : undefined}
                        className="absolute inset-0 h-full w-full object-cover"
                        controls
                        muted
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── BOOK ──────────────────────────────────────────────────────────── */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <H2 rule light className="[&>span]:mx-auto">
                Book your next listing.
              </H2>
              <p className="mt-6 text-lg text-white/85">
                {SIGNATURE.price} per listing, {SIGNATURE.turnaround.toLowerCase()}. Tell us the
                address and when you need it.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href={BOOK} variant="white">
                  Book this listing
                </CTAButton>
                <CTAButton href={`tel:${SITE.phoneIntl}`} variant="outline-light" external>
                  {SITE.phone}
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
