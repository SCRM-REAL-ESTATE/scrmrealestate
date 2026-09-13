import type { Metadata } from "next";
import Image from "next/image";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import { LISTING_PACKAGES } from "@/lib/pricing";
import { MEDIA_ITEMS, mediaByCategory, mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";

/**
 * Paid-traffic landing page for the Signature package.
 *
 * Ads point here, so it answers the only three questions a cold visitor has —
 * what does it cost, what do I get, what does that look like — and then asks
 * for the booking. Deliberately no navigation detours, no philosophy and no
 * second offer: every section either shows the work or books it.
 *
 * The examples are the real deliverables rather than stock, because the whole
 * argument is "this is what lands in your inbox".
 */

const SIGNATURE = LISTING_PACKAGES.find((p) => p.id === "pkg-signature")!;

export const metadata: Metadata = {
  title: `Listing photography, floor plan and video from ${SIGNATURE.price}`,
  description: `${SIGNATURE.price} per listing. ${SIGNATURE.products}, delivered next business day: professionally edited photos, a 2D colour floor plan, a landscape listing video and a vertical agent-led video with you on camera.`,
  alternates: { canonical: "/signature" },
};

const BOOK = `/book?p=${SIGNATURE.id}`;

/** The example that sits beside each line of the package. */
const photos = mediaByCategory("listing")
  .filter((i) => i.type === "image")
  .slice(0, 4);
const verticalVideo = MEDIA_ITEMS.find((i) => i.src === "vertical/vertical-3-bed.mp4");
const landscapeVideo = MEDIA_ITEMS.find((i) => i.src === "landscape/landscape-2-bed.mp4");

export default function SignaturePage() {
  return (
    <>
      {/* ── PRICE ─────────────────────────────────────────────────────────── */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          <Container className="relative py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
              <Reveal direction="up">
                <p className="label-eyebrow !text-white/75">Listing package</p>
                <h1 className="mt-4 h-display text-4xl sm:text-5xl md:text-6xl text-white">
                  Your next listing, shot properly.
                </h1>

                <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-serif text-6xl md:text-7xl text-white">{SIGNATURE.price}</span>
                  <span className="text-white/75">per listing</span>
                </div>

                <p className="mt-5 max-w-xl text-lg text-white/85 leading-relaxed">
                  Photos, floor plan, listing video and a vertical video with you on camera.
                  {" "}{SIGNATURE.products}, back {SIGNATURE.turnaround.toLowerCase()}.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <CTAButton href={BOOK} variant="white">
                    Book this listing
                  </CTAButton>
                  <CTAButton href={`tel:${SITE.phoneIntl}`} variant="outline-light" external>
                    {SITE.phone}
                  </CTAButton>
                </div>

                <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {["No contract", "No lock-in", "Book per listing"].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <span aria-hidden className="text-re-gold-thin">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* The agent video, playing. It is the thing the package is bought for. */}
              {verticalVideo && (
                <Reveal direction="up" delay={0.12}>
                  <div className="relative mx-auto w-full max-w-[300px] aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.3)]">
                    <video
                      src={mediaUrl(verticalVideo.src)}
                      poster={verticalVideo.poster ? mediaUrl(verticalVideo.poster) : undefined}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </Reveal>
              )}
            </div>
          </Container>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────── */}
      <Section panel="white">
        <Container>
          <Reveal>
            <H2 rule>What you get.</H2>
          </Reveal>

          <div className="mt-12 space-y-12 md:space-y-16">
            {/* Photos */}
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-center">
                <div>
                  <p className="label-eyebrow">01</p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl text-re-ink">
                    18 professionally edited photos
                  </h3>
                  <p className="mt-4 text-re-stone leading-relaxed">
                    Shot on DSLR and edited by hand. Sized for the portals and ready to go live.
                  </p>
                </div>
                <Stagger className="grid grid-cols-2 gap-3 md:gap-4" staggerChildren={0.07}>
                  {photos.map((photo) => (
                    <StaggerChild key={photo.src} className="overflow-hidden rounded-2xl">
                      <Image
                        src={mediaUrl(photo.src)}
                        alt={photo.alt ?? "Listing photography"}
                        width={photo.width}
                        height={photo.height}
                        className="block w-full h-full object-cover aspect-[4/3]"
                      />
                    </StaggerChild>
                  ))}
                </Stagger>
              </div>
            </Reveal>

            {/* Floor plan */}
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-center">
                <div>
                  <p className="label-eyebrow">02</p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl text-re-ink">
                    2D colour floor plan
                  </h3>
                  <p className="mt-4 text-re-stone leading-relaxed">
                    Every room measured and labelled, with the total area at the bottom.
                  </p>
                </div>
                {/* Portrait, so it is held to a column of its own: at the full
                    grid width it runs ~900px tall and swamps the page. */}
                <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-re-stone-light bg-white p-4 md:p-5">
                  <Image
                    src="/media/examples/floor-plan.jpg"
                    alt="2D colour floor plan with room dimensions and total area"
                    width={1600}
                    height={2204}
                    className="block w-full h-auto"
                  />
                </div>
              </div>
            </Reveal>

            {/* Listing video */}
            {landscapeVideo && (
              <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-center">
                  <div>
                    <p className="label-eyebrow">03</p>
                    <h3 className="mt-3 font-serif text-3xl md:text-4xl text-re-ink">
                      Landscape listing video
                    </h3>
                    <p className="mt-4 text-re-stone leading-relaxed">
                      A walkthrough of the property, cut for the listing and for your socials.
                    </p>
                    {/* The example was shot with aerial. Saying so here stops the
                        package reading as though drone is included at this price. */}
                    <p className="mt-5 rounded-2xl bg-re-blue-light px-5 py-4 text-sm leading-relaxed text-re-ink">
                      This example includes drone shots. Aerial is an optional extra and is not
                      included in the {SIGNATURE.price} package.
                    </p>
                  </div>
                  <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-re-stone-light">
                    <video
                      src={mediaUrl(landscapeVideo.src)}
                      poster={landscapeVideo.poster ? mediaUrl(landscapeVideo.poster) : undefined}
                      className="absolute inset-0 h-full w-full object-cover"
                      controls
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </div>
              </Reveal>
            )}

            {/* Agent video */}
            {verticalVideo && (
              <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-center">
                  <div>
                    <p className="label-eyebrow">04</p>
                    <h3 className="mt-3 font-serif text-3xl md:text-4xl text-re-ink">
                      Vertical agent-led video
                    </h3>
                    <p className="mt-4 text-re-stone leading-relaxed">
                      You on camera at the property, branded to you and cut for Reels and TikTok.
                      The listing sells the property. This sells you.
                    </p>
                  </div>
                  <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] overflow-hidden rounded-2xl bg-re-stone-light">
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
              </Reveal>
            )}
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
