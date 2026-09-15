import type { Metadata } from "next";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import BeforeAfter from "@/components/BeforeAfter";
import { VACANT_PROPERTY } from "@/lib/pricing";
import { SITE } from "@/lib/site";

/**
 * Virtual staging, for sales listings and rentals.
 *
 * The argument is entirely visual, so the page is built around the wipes and
 * says as little as it can get away with around them. Every pair is the same
 * property, same camera position, shot and staged by us.
 */

const STAGING = VACANT_PROPERTY.options.find(
  (o) => o.id === "add-virtual-staging",
)!;
const PACK = VACANT_PROPERTY.options.find((o) => o.id === "add-vacant-pack")!;

export const metadata: Metadata = {
  title: `Virtual staging for listings and rentals, from ${STAGING.price}`,
  description: `Virtual staging from ${STAGING.price} for five rooms. Send us photos of an empty property and we furnish the rooms that need it, for sales listings and rental advertising. Staged rooms carry through to your listing video at no extra cost.`,
  alternates: { canonical: "/virtual-staging" },
};

/** The listing video for the same property, so the staging can be seen moving. */
const LISTING_VIDEO_YOUTUBE_ID = "QALPUZWiHBw";

const PAIRS = [
  {
    name: "living",
    alt: "Open plan living and dining, before and after virtual staging",
    caption: "Living and dining",
  },
  {
    name: "bedroom-main",
    alt: "Main bedroom, before and after virtual staging",
    caption: "Main bedroom",
  },
  {
    name: "bedroom-two",
    alt: "Second bedroom, before and after virtual staging",
    caption: "Second bedroom",
  },
  {
    name: "bedroom-three",
    alt: "Third bedroom, before and after virtual staging",
    caption: "Third bedroom",
  },
  {
    name: "garage",
    alt: "Garage, before and after decluttering",
    caption: "Garage, decluttered",
    afterLabel: "Decluttered",
  },
];

export default function VirtualStagingPage() {
  return (
    <>
      {/* ── PITCH ─────────────────────────────────────────────────────────── */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          <Container className="relative py-10 md:py-12">
            <Reveal direction="up">
              <div className="mx-auto max-w-5xl text-center">
                <p className="label-eyebrow !text-white/75">Virtual staging</p>
                <h1 className="mt-3 h-display text-4xl sm:text-5xl md:text-6xl text-white">
                  An empty room is a hard sell.
                </h1>

                <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
                  <span className="mr-1 align-middle font-sans text-2xl text-white/75">
                    From
                  </span>
                  <span className="font-serif text-5xl md:text-6xl text-white">
                    {STAGING.price}
                  </span>
                  <span className="text-white/75">for five rooms</span>
                </div>

                <p className="mt-4 mx-auto max-w-2xl text-lg text-white/85 leading-relaxed">
                  Send us photographs of a vacant property and we furnish the
                  rooms that need it. For sales campaigns and for rental
                  advertising, on stock you have already shot.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <CTAButton href={`/book?p=${STAGING.id}`} variant="white">
                    Stage a property
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
                  {[
                    "Sales and rentals",
                    "Use your own photos",
                    "Labelled as staged",
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <span aria-hidden className="text-re-gold-thin">
                        ◆
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* ── THE WIPES ─────────────────────────────────────────────────────── */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <H2 rule className="text-center [&>span]:mx-auto">
                Drag to compare.
              </H2>
              <p className="mt-4 text-re-stone leading-relaxed">
                One property, shot as we found it and finished afterwards. Four
                rooms furnished, one garage cleared. Pull the handle across any
                of them.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {PAIRS.map((p, i) => {
              // Odd count, so the last one would sit alone against the left
              // edge. It spans the row instead and centres at a column's width.
              const last = i === PAIRS.length - 1;
              return (
                <Reveal
                  key={p.name}
                  delay={i === 0 ? 0 : 0.06}
                  className={last ? "lg:col-span-2" : undefined}
                >
                  <div
                    className={
                      last ? "lg:mx-auto lg:w-[calc(50%-1.25rem)]" : undefined
                    }
                  >
                    <BeforeAfter
                      before={`/media/examples/staging/${p.name}-before.jpg`}
                      after={`/media/examples/staging/${p.name}-after.jpg`}
                      alt={p.alt}
                      caption={p.caption}
                      afterLabel={p.afterLabel}
                      priority={i === 0}
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── IT CARRIES INTO THE VIDEO ─────────────────────────────────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <H2 rule className="text-center [&>span]:mx-auto">
                The video is staged too.
              </H2>
              <p className="mt-4 text-re-stone leading-relaxed">
                The rooms we furnish carry through to the listing video at no
                extra cost, so the campaign doesn&apos;t show a furnished
                photograph and an empty walkthrough. This is the same property.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto mt-8 w-full max-w-4xl aspect-video overflow-hidden rounded-2xl bg-re-ink">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${LISTING_VIDEO_YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`}
                title="Listing video with virtual staging"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-re-blue">
              This example also includes drone shots, which are an optional
              extra.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <Section panel="tint" id="pricing">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <H2 rule className="text-center [&>span]:mx-auto">
                What it costs.
              </H2>
              <p className="mt-4 text-re-stone leading-relaxed">
                {VACANT_PROPERTY.intro}
              </p>
            </div>
          </Reveal>

          {/* The listing video is its own product and is sold on Services. On a
              staging page it reads as a third staging tier, so it is left out
              here rather than removed from the shared data. */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 sm:grid-cols-2 gap-5">
            {VACANT_PROPERTY.options
              .filter((o) => o.id !== "add-listing-video")
              .map((o) => (
                <Reveal key={o.id}>
                  <div
                    className={`gold-ring flex h-full flex-col rounded-[1.5rem] border p-6 text-center ${
                      o.featured
                        ? "blue-fade border-re-blue text-white"
                        : "border-re-stone-light bg-white"
                    }`}
                  >
                    <p
                      className={`label-eyebrow ${o.featured ? "!text-white/85" : ""}`}
                    >
                      {o.name}
                    </p>
                    <p
                      className={`mt-2 font-serif text-4xl ${
                        o.featured ? "text-white" : "text-re-ink"
                      }`}
                    >
                      {o.price}
                    </p>
                    {o.note && (
                      <p
                        className={`mt-2 text-sm ${o.featured ? "text-white/80" : "text-re-stone"}`}
                      >
                        {o.note}
                      </p>
                    )}
                    <ul
                      className={`mt-4 space-y-2 border-t pt-4 text-sm ${
                        o.featured
                          ? "border-white/20 text-white/90"
                          : "border-re-stone-light text-re-ink"
                      }`}
                    >
                      {o.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-grow items-end justify-center">
                      <CTAButton
                        href={`/book?p=${o.id}`}
                        variant={o.featured ? "outline-light" : "solid"}
                      >
                        Book this
                      </CTAButton>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-re-stone">
              {VACANT_PROPERTY.smallPrint}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <H2 rule light className="[&>span]:mx-auto">
                Send us the empty rooms.
              </H2>
              <p className="mt-6 text-lg text-white/85">
                Photographs of the property and which rooms you want furnished
                is enough to start.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href={`/book?p=${PACK.id}`} variant="white">
                  Stage a property
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
