import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ListingPhotoGrid from "@/components/ListingPhotoGrid";
import {
  BookBand,
  ExampleExtrasNote,
  FloorPlanExample,
  ListingVideoEmbed,
  PackageHero,
  Step,
  StepBlurb,
} from "@/components/PackageLanding";
import { LISTING_PACKAGES } from "@/lib/pricing";
import { listingPhotos } from "@/lib/examples";

/**
 * Paid-traffic landing page for the Listing package — /signature for the entry
 * price, built from the same pieces so the two cannot drift apart.
 *
 * It sells three products rather than four, and the one it leaves out is the
 * vertical agent video. That is the whole difference between the two packages,
 * so this page does not mention it: an ad landing page that spends a section
 * on what you are not buying talks a visitor out of the thing they clicked.
 * The upgrade is a decision for the booking funnel, which shows both.
 */

const LISTING = LISTING_PACKAGES.find((p) => p.id === "pkg-listing")!;

export const metadata: Metadata = pageMeta({
  title: `Listing photography, floor plan and video from ${LISTING.price}`,
  share: `The Listing package, ${LISTING.price} a listing`,
  description: `${LISTING.price} per listing. ${LISTING.products}: professionally edited photos, a 2D floor plan and a landscape listing video. Everything you need to get a listing live.`,
  path: "/listing",
  card: "listing",
  cardAlt: "A living room from the example listing set",
});

const BOOK = `/book?p=${LISTING.id}`;

const PHOTOS = listingPhotos(LISTING.id);

export default function ListingPage() {
  return (
    <>
      <PackageHero
        headline="Everything a listing needs to go live."
        price={LISTING.price}
        blurb={
          <>
            Photos, a floor plan and a listing video. {LISTING.products}, shot in
            one visit.
          </>
        }
        bookHref={BOOK}
      />

      <Section panel="white">
        <Container>
          <Reveal>
            <H2 rule className="text-center [&>span]:mx-auto">
              What&apos;s included.
            </H2>
          </Reveal>

          <div className="mt-10 space-y-12 md:space-y-16">
            <Reveal>
              <div>
                <Step n="01" title={`${PHOTOS.length} professionally edited photos`}>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Shot on DSLR and edited by hand. A whole set, exactly as it lands
                    in your inbox. Tap to look through them.
                  </p>
                </Step>
                <ListingPhotoGrid photos={PHOTOS} />
              </div>
            </Reveal>

            <Reveal>
              <div>
                <Step n="02" title="Landscape listing video">
                  <ExampleExtrasNote price={LISTING.price} />
                </Step>
                <ListingVideoEmbed />
              </div>
            </Reveal>

            {/* The floor plan is portrait and has nothing to pair with on this
                package, so it is held to a column width rather than stretched
                across the band. */}
            <Reveal>
              <div className="mx-auto max-w-lg">
                <Step n="03" title="2D floor plan">
                  <StepBlurb>
                    Every room measured and labelled, with the total area at the
                    bottom.
                  </StepBlurb>
                </Step>
                <FloorPlanExample />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <BookBand price={LISTING.price} bookHref={BOOK} />
    </>
  );
}
