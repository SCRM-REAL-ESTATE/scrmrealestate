import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ListingPhotoGrid from "@/components/ListingPhotoGrid";
import {
  BookBand,
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
 * Paid-traffic landing page for the Premiere package, built from the same
 * pieces as /signature and /listing.
 *
 * What separates this package from the two below it is that the property film
 * is filmed rather than assembled from stills, so the example in section 02 is
 * one of the real filmed landscape videos — not the stills-built one the
 * cheaper pages show, which would undersell the one thing the extra money
 * buys.
 */

const PREMIERE = LISTING_PACKAGES.find((p) => p.id === "pkg-premiere")!;

export const metadata: Metadata = pageMeta({
  title: `Filmed property film, photography and aerial from ${PREMIERE.price}`,
  share: `The Premiere package, ${PREMIERE.price} a listing`,
  description: `${PREMIERE.price} per listing. ${PREMIERE.products}: professionally edited photos, a 2D floor plan, a filmed landscape property film, a vertical agent-led video and aerial photography and footage.`,
  path: "/premiere",
  card: "premiere",
  cardAlt: "A bedroom with a city outlook, photographed for a listing campaign",
});

const BOOK = `/book?p=${PREMIERE.id}`;

/**
 * Premiere delivers 25 photographs and the example set runs to 18, so the copy
 * beside the grid calls it a recent set rather than the delivered count. The
 * heading still states what the package delivers. Shooting a 25-frame example
 * set would let this page show the count the way the other two do.
 */
const PHOTOS = listingPhotos(PREMIERE.id);

/**
 * The filmed property film, unlisted on YouTube.
 *
 * The same video runs in the Listing Video tab on /work, but from our own
 * bucket, where it is still sitting at the resolution the old encoder wrote.
 * Shot on camera rather than built from stills is the whole distinction this
 * page is selling, so it is served from YouTube here: adaptive streaming sends
 * a phone a rendition it can actually play, and a soft file is the last thing
 * this particular section can afford to be.
 */
const PROPERTY_FILM_YOUTUBE_ID = "TUNj81RcbVE";

const verticalVideo = MEDIA_ITEMS.find((i) => i.src === "vertical/vertical-3-bed.mp4");

export default function PremierePage() {
  return (
    <>
      <PackageHero
        headline="The full campaign, filmed properly."
        price={PREMIERE.price}
        blurb={
          <>
            Photos, a floor plan, a filmed property film, a vertical video with you
            on camera, and aerial. {PREMIERE.products}.
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
                <Step n="01" title={`${PREMIERE.photos} professionally edited photos`}>
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Shot on DSLR and edited by hand. Here is a recent set to look
                    through. Tap to open it.
                  </p>
                </Step>
                <ListingPhotoGrid photos={PHOTOS} />
              </div>
            </Reveal>

            <Reveal>
              <div>
                <Step n="02" title="Filmed landscape property film">
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Filmed on camera through the property rather than built from
                    stills, so the house moves the way a buyer walks it. Aerial is
                    cut into it, and is included at this price.
                  </p>
                </Step>
                <YouTubeEmbed
                  id={PROPERTY_FILM_YOUTUBE_ID}
                  title="Filmed landscape property film"
                />
              </div>
            </Reveal>

            {/* Both portrait, so they pair into one row rather than taking a
                full-width band each. */}
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

            {/* The only inclusion with no example of its own. The drone stills are
                delivered with the photographs and the footage is already playing
                in 02, so this states what lands rather than showing it twice. */}
            <Reveal>
              <div>
                <Step n="05" title="Aerial photography and footage">
                  <p className="mt-3 text-re-stone leading-relaxed">
                    Drone stills of the property and its street, delivered with the
                    rest of the photographs, and the footage cut into the film
                    above. On the packages below this one, aerial is a paid extra.
                  </p>
                </Step>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <BookBand price={PREMIERE.price} bookHref={BOOK} />
    </>
  );
}
