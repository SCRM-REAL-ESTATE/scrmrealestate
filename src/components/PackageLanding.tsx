import Image from "next/image";
import { Container, H2, CTAButton, Section } from "./ui";
import { Reveal } from "./Reveal";
import { SITE } from "@/lib/site";

/**
 * The parts a package landing page is built from.
 *
 * There is one of these pages per package we run ads to, and they have to stay
 * the same page — a cold visitor who clicks two different ads should not find
 * two different sites. Every page composes these pieces itself rather than
 * passing a configuration object to one component: what changes between them
 * is which sections exist and how they sit together, which is exactly the part
 * worth reading in the page file.
 *
 * Wording lives here on purpose. The lines below are the ones that have to
 * match across every package, so a correction to a disclaimer or a booking
 * prompt lands on all of them at once.
 */

/**
 * Price first, no media.
 *
 * Ads answer the same three questions in the same order — what does it cost,
 * what do I get, what does that look like — so the price is the first and
 * largest thing on the page, and the proof comes after it. Centred and given
 * the container's full width: ranged left it wrapped the headline early and
 * left half the panel empty, which made a short amount of copy occupy a tall
 * block.
 */
export function PackageHero({
  headline,
  price,
  blurb,
  bookHref,
}: {
  headline: string;
  price: string;
  blurb: React.ReactNode;
  bookHref: string;
}) {
  return (
    <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
        <Container className="relative py-10 md:py-12">
          <Reveal direction="up">
            <div className="mx-auto max-w-5xl text-center">
              <p className="label-eyebrow !text-white/75">Listing package</p>
              <h1 className="mt-3 h-display text-4xl sm:text-5xl md:text-6xl text-white">
                {headline}
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
                <span className="font-serif text-5xl md:text-6xl text-white">{price}</span>
                <span className="text-white/75">per listing</span>
              </div>

              <p className="mt-4 mx-auto max-w-2xl text-lg text-white/85 leading-relaxed">
                {blurb}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href={bookHref} variant="white">
                  Book this listing
                </CTAButton>
                <CTAButton href={`tel:${SITE.phoneIntl}`} variant="outline-light" external>
                  {SITE.phone}
                </CTAButton>
              </div>

              <ul className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                {["No contract", "No lock-in", "Book per listing"].map((line) => (
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
  );
}

/** One numbered item in the included list. The number carries the counting, so
 *  it is set large enough to be read as one at a glance. */
export function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-serif text-5xl md:text-6xl gold-text">{n}</p>
      <h3 className="mt-2 font-serif text-3xl md:text-4xl text-re-ink">{title}</h3>
      {children}
    </div>
  );
}

export function StepBlurb({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 mx-auto max-w-md text-re-stone leading-relaxed">{children}</p>;
}

/**
 * The example video carries aerial and virtual staging, both paid add-ons.
 * Saying so stops the package reading as though either is included at its
 * price. Set as a plain line rather than a callout: a panel here read as a
 * warning about the work instead of a note about the example.
 */
export function ExampleExtrasNote({ price }: { price: string }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-re-blue">
      This example includes drone shots and virtual staging. Both are optional extras
      and are not included in the {price} package.
    </p>
  );
}

/**
 * The finished listing video, unlisted on YouTube.
 *
 * Served from there rather than our own storage because the master is 4K and
 * too large to publish through the media pipeline from here. YouTube also
 * streams adaptively, so a phone is sent a 720p rendition rather than the full
 * file, and it carries the load an ad campaign puts on it.
 *
 * Replace with an entry in media.json once `npm run media` has published a
 * web-sized encode, and this becomes a <video>. Until then the video must stay
 * Unlisted, not Private, and keep "Allow embedding" ticked: either would blank
 * the player.
 *
 * nocookie serves the player without setting tracking cookies until someone
 * actually plays it, which is what removes the consent prompt. rel=0 keeps the
 * end screen to this channel rather than offering strangers' videos on a page
 * we are paying for traffic to.
 */
export const LISTING_VIDEO_YOUTUBE_ID = "QALPUZWiHBw";

export function ListingVideoEmbed() {
  return (
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
  );
}

export function FloorPlanExample() {
  return (
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
  );
}

export function BookBand({ price, bookHref }: { price: string; bookHref: string }) {
  return (
    <Section panel="blue">
      <Container>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <H2 rule light className="[&>span]:mx-auto">
              Book your next listing.
            </H2>
            <p className="mt-6 text-lg text-white/85">
              {price} per listing. Tell us the address and when you need it.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <CTAButton href={bookHref} variant="white">
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
  );
}
