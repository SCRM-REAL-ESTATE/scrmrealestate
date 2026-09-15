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
  description: `${SIGNATURE.price} per listing. ${SIGNATURE.products}: professionally edited photos, a 2D floor plan, a landscape listing video and a vertical agent-led video with you on camera.`,
  alternates: { canonical: "/signature" },
};

const BOOK = `/book?p=${SIGNATURE.id}`;

/**
 * The full delivered set for one listing rather than a selection: the offer is
 * a count, so the count is shown instead of claimed.
 */
const LISTING_PHOTOS = Array.from(
  { length: 18 },
  (_, i) => `/media/examples/listing/${String(i + 1).padStart(2, "0")}.jpg`,
);

const verticalVideo = MEDIA_ITEMS.find(
  (i) => i.src === "vertical/vertical-3-bed.mp4",
);

/**
 * The finished listing video, unlisted on YouTube.
 *
 * Served from there rather than our own storage because the master is 4K and
 * too large to publish through the media pipeline from here. YouTube also
 * streams adaptively, so a phone is sent a 720p rendition rather than the full
 * file, and it carries the load an ad campaign puts on it.
 *
 * Replace with an entry in media.json once `npm run media` has published a
 * web-sized encode, and this becomes a <video> like the agent one below it.
 * Until then the video must stay Unlisted, not Private, and keep "Allow
 * embedding" ticked: either would blank the player on this page.
 */
const LISTING_VIDEO_YOUTUBE_ID = "QALPUZWiHBw";

export default function SignaturePage() {
  return (
    <>
      {/* ── PRICE ─────────────────────────────────────────────────────────── */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          {/* Centred and given the container's full width: ranged left it wrapped
              the headline early and left half the panel empty, which made a
              short amount of copy occupy a tall block. */}
          <Container className="relative py-10 md:py-12">
            <Reveal direction="up">
              <div className="mx-auto max-w-5xl text-center">
                <p className="label-eyebrow !text-white/75">Listing package</p>
                <h1 className="mt-3 h-display text-4xl sm:text-5xl md:text-6xl text-white">
                  Your next listing, shot properly.
                </h1>

                <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
                  <span className="font-serif text-5xl md:text-6xl text-white">
                    {SIGNATURE.price}
                  </span>
                  <span className="text-white/75">per listing</span>
                </div>

                <p className="mt-4 mx-auto max-w-2xl text-lg text-white/85 leading-relaxed">
                  Photos, a listing video, a floor plan and a vertical video
                  with you on camera. {SIGNATURE.products}.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <CTAButton href={BOOK} variant="white">
                    Book this listing
                  </CTAButton>
                  <CTAButton
                    href={`tel:${SITE.phoneIntl}`}
                    variant="outline-light"
                    external
                  >
                    {SITE.phone}
                  </CTAButton>
                </div>

                <ul className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {["No contract", "No lock-in", "Book per listing"].map(
                    (line) => (
                      <li key={line} className="flex items-center gap-2">
                        <span aria-hidden className="text-re-gold-thin">
                          ◆
                        </span>
                        {line}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────── */}
      <Section panel="white">
        <Container>
          <Reveal>
            <H2 rule className="text-center [&>span]:mx-auto">
              What&apos;s included.
            </H2>
          </Reveal>

          <div className="mt-10 space-y-12 md:space-y-16">
            {/* Photos — the whole set, openable */}
            <Reveal>
              <div>
                <div className="mx-auto max-w-2xl text-center">
                  <p className="font-serif text-5xl md:text-6xl gold-text">01</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    18 professionally edited photos
                  </h3>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Shot on DSLR and edited by hand. A whole set, exactly as it
                    lands in your inbox. Tap to look through them.
                  </p>
                </div>
                <ListingPhotoGrid photos={LISTING_PHOTOS} />
              </div>
            </Reveal>

            {/* Listing video */}
            <Reveal>
              <div>
                <div className="mx-auto max-w-2xl text-center">
                  <p className="font-serif text-5xl md:text-6xl gold-text">02</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    Landscape listing video
                  </h3>
                  {/* The example carries aerial and virtual staging, both paid
                      add-ons. Saying so stops the package reading as though
                      either is included at this price. Set as a plain line
                      rather than a callout: a panel here read as a warning
                      about the work instead of a note about the example. */}
                  <p className="mt-4 text-sm leading-relaxed text-re-blue">
                    This example includes drone shots and virtual staging. Both
                    are optional extras and are not included in the{" "}
                    {SIGNATURE.price} package.
                  </p>
                </div>
                {/* nocookie serves the player without setting tracking
                    cookies until someone actually plays it, which is what
                    removes the consent prompt. rel=0 keeps the end screen to
                    this channel rather than offering strangers' videos on a
                    page we are paying for traffic to. */}
                <div className="relative mt-6 w-full aspect-video overflow-hidden rounded-2xl bg-re-ink">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${LISTING_VIDEO_YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`}
                    title="Landscape listing video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
            </Reveal>

            {/* Both of these are portrait, so they pair into one row rather than
                taking a full-width band each. */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
                {/* Centred: the media below sits centred in its column, so a
                    left-aligned heading reads as misaligned against it. */}
                <div className="text-center">
                  <p className="font-serif text-5xl md:text-6xl gold-text">03</p>
                  <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                    2D floor plan
                  </h3>
                  <p className="mt-3 mx-auto max-w-md text-re-stone leading-relaxed">
                    Every room measured and labelled, with the total area at the
                    bottom.
                  </p>
                  <div className="mt-6 rounded-2xl border border-re-stone-light bg-white p-4">
                    <Image
                      src="/media/examples/floor-plan.jpg"
                      alt="2D floor plan with room dimensions and total area"
                      width={1600}
                      height={2204}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      quality={90}
                      className="block w-full h-auto"
                    />
                  </div>
                </div>

                {verticalVideo && (
                  <div className="text-center">
                    <p className="font-serif text-5xl md:text-6xl gold-text">04</p>
                    <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">
                      Vertical agent-led video
                    </h3>
                    <p className="mt-3 mx-auto max-w-md text-re-stone leading-relaxed">
                      You on camera at the property, branded to you and cut for
                      Reels and TikTok. The listing sells the property. This
                      sells you.
                    </p>
                    <div className="relative mt-6 mx-auto w-full max-w-[420px] aspect-[9/16] overflow-hidden rounded-2xl bg-re-stone-light">
                      <video
                        src={mediaUrl(verticalVideo.src)}
                        poster={
                          verticalVideo.poster
                            ? mediaUrl(verticalVideo.poster)
                            : undefined
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                        controls
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
                {SIGNATURE.price} per listing. Tell us the address and when you
                need it.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href={BOOK} variant="white">
                  Book this listing
                </CTAButton>
                <CTAButton
                  href={`tel:${SITE.phoneIntl}`}
                  variant="outline-light"
                  external
                >
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
