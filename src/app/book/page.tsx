import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import BookingFlow from "@/components/BookingFlow";
import { getOffer, type Stream } from "@/lib/catalogue";
import { LISTING_PRICE_RANGE } from "@/lib/pricing";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a shoot",
  description:
    `Book listing media, a commercial campaign or monthly content in under a minute. Packages ${LISTING_PRICE_RANGE}, add-ons priced as you go, delivered the next business day.`,
  alternates: { canonical: "/book" },
};

const STREAM_IDS: Stream[] = ["residential", "commercial", "monthly"];

/**
 * Where every Book button on the site lands.
 *
 * `?p=` carries the package the button was attached to, so someone who clicked
 * Book on a commercial card is never asked whether this is commercial. `?stream=`
 * does the same one level up, for a pricing page where no tier was chosen yet.
 * Bare /book is the only path that has to ask.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; stream?: string }>;
}) {
  const params = await searchParams;

  const offer = getOffer(params.p);
  const stream: Stream | undefined =
    offer?.stream ??
    (STREAM_IDS.includes(params.stream as Stream) ? (params.stream as Stream) : undefined);

  const heading = offer
    ? offer.recurring || offer.quote
      ? `Let's talk about ${offer.name}.`
      : `Book ${offer.name}.`
    : stream === "commercial"
      ? "Book a commercial campaign."
      : stream === "monthly"
        ? "Start monthly content."
        : "Book your shoot.";

  const sub = offer
    ? offer.quote
      ? "Tell us what the asset is and we'll come back with a scope and a number."
      : offer.recurring
        ? "A month of content, planned, filmed and posted for you. No lock-in."
        : `${offer.name} is ${offer.price}. Add what the property deserves below, or leave it exactly as it is.`
    : stream === "commercial"
      ? "Office, industrial, retail, development sites and land. Scheduled backwards from your close date."
      : stream === "monthly"
        ? "For an individual agent or for the whole agency. Filmed in one batch a month."
        : "Pick a package, add what the property deserves, and we'll call to lock in a time.";

  return (
    <>
      <section className="px-3 pt-2 md:px-6 md:pt-3">
        <div className="blue-fade rounded-[2rem] text-white md:rounded-[2.5rem]">
          <Container className="py-12 md:py-16">
            <Reveal>
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <h1 className="h-display max-w-3xl text-4xl text-white md:text-6xl">{heading}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{sub}</p>
              <ul className="mt-8 grid grid-cols-1 gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.18em] text-white/70 sm:flex sm:flex-wrap">
                {[
                  "Takes about a minute",
                  "No payment today",
                  "Delivered next business day",
                ].map((line) => (
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

      <Section className="!pt-12 md:!pt-16">
        <Container>
          <BookingFlow initialOfferId={offer?.id} initialStream={stream} />
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <p className="text-sm text-re-stone">
            Would rather talk it through? Call{" "}
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="text-re-blue underline decoration-re-blue-accent/40 underline-offset-4 transition-colors hover:text-re-blue-accent"
            >
              {SITE.phone}
            </a>{" "}
            and we&apos;ll work out what the property needs.
          </p>
        </Container>
      </Section>
    </>
  );
}
