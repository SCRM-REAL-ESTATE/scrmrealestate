import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ListingPhotoGrid from "@/components/ListingPhotoGrid";
import {
  BookBand,
  ExampleExtrasNote,
  FloorPlanExample,
  MediaVideo,
  PackageHero,
  Step,
  StepBlurb,
  YouTubeEmbed,
} from "@/components/PackageLanding";
import { LISTING_PACKAGES } from "@/lib/pricing";
import { listingPhotos } from "@/lib/examples";
import { MEDIA_ITEMS } from "@/lib/media";

/**
 * Paid-traffic landing page for the Signature package.
 *
 * Ads point here, so it answers the only three questions a cold visitor has —
 * what does it cost, what do I get, what does that look like — and then asks
 * for the booking. Deliberately no navigation detours, no philosophy and no
 * second offer: every section either shows the work or books it.
 *
 * /listing is the same page for the cheaper package. The shared parts live in
 * components/PackageLanding so the two cannot drift apart.
 */

const SIGNATURE = LISTING_PACKAGES.find((p) => p.id === "pkg-signature")!;

export const metadata: Metadata = pageMeta({
  title: `Listing photography, floor plan and video from ${SIGNATURE.price}`,
  share: `The Signature package, ${SIGNATURE.price} a listing`,
  description: `${SIGNATURE.price} per listing. ${SIGNATURE.products}: professionally edited photos, a 2D floor plan, a landscape listing video and a vertical agent-led video with you on camera.`,
  path: "/signature",
  card: "signature",
  cardAlt: "A kitchen from the Signature example listing",
});

const BOOK = `/book?p=${SIGNATURE.id}`;

/** The delivered set for one listing rather than a selection: the offer is a
 *  count, so the count is shown instead of claimed. */
const PHOTOS = listingPhotos(SIGNATURE.id);

const verticalVideo = MEDIA_ITEMS.find((i) => i.src === "vertical/vertical-3-bed.mp4");

export default function SignaturePage() {
  return (
    <>
      <PackageHero
        headline="Your next listing, shot properly."
        price={SIGNATURE.price}
        blurb={
          <>
            Photos, a listing video, a floor plan and a vertical video with you on
            camera. {SIGNATURE.products}.
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
                  <ExampleExtrasNote price={SIGNATURE.price} />
                </Step>
                <YouTubeEmbed />
              </div>
            </Reveal>

            {/* Both of these are portrait, so they pair into one row rather than
                taking a full-width band each. */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
                <div>
                  <Step n="03" title="2D floor plan">
                    <StepBlurb>
                      Every room measured and labelled, with the total area at the
                      bottom.
                    </StepBlurb>
                  </Step>
                  <FloorPlanExample />
                </div>

                {verticalVideo && (
                  <div>
                    <Step n="04" title="Vertical agent-led video">
                      <StepBlurb>
                        You on camera at the property, branded to you and cut for
                        Reels and TikTok. The listing sells the property. This sells
                        you.
                      </StepBlurb>
                    </Step>
                    <MediaVideo
                      item={verticalVideo}
                      className="mx-auto w-full max-w-[420px] aspect-[9/16]"
                    />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <BookBand price={SIGNATURE.price} bookHref={BOOK} />
    </>
  );
}
