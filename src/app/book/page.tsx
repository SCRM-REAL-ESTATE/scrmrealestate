import type { Metadata } from "next";
import { Container } from "@/components/ui";
import BookingFlow from "@/components/BookingFlow";
import { getOffer, type Stream } from "@/lib/catalogue";
import { LISTING_PRICE_RANGE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Book a shoot",
  description: `Book listing media in under a minute. Packages ${LISTING_PRICE_RANGE}, extras priced as you add them, delivered the next business day.`,
  alternates: { canonical: "/book" },
};

const STREAM_IDS: Stream[] = ["residential", "commercial", "monthly"];

/**
 * Where every Book button on the site lands.
 *
 * Deliberately no hero. Someone who has clicked "Book a shoot" has already been
 * sold — a screen of marketing between them and the first choice is a screen of
 * scrolling, and on a phone it pushed the actual booking below the fold. The
 * header is one line, and the first decision is visible on load.
 *
 * `?p=` carries the package the button was attached to and `?stream=` the
 * pricing page it came from, so the funnel opens with that already filled in.
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

  return (
    <div className="pb-16 pt-10 md:pt-14">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="h-display text-3xl text-re-ink md:text-4xl">Book a shoot</h1>
          <p className="text-sm text-re-stone">
            Takes about a minute · delivered next business day · no payment today
          </p>
        </div>

        <div className="mt-7 md:mt-9">
          <BookingFlow initialOfferId={offer?.id} initialStream={stream} />
        </div>
      </Container>
    </div>
  );
}
