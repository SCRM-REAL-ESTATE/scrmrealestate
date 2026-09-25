import { LISTING_PACKAGES } from "./pricing";

/**
 * The example listing set.
 *
 * One property, photographed and edited the way every job is, sitting in
 * public/media/examples/listing as 01.jpg … 18.jpg. It is the proof on the
 * package landing pages: not a selection of the good ones, the delivered set.
 */
const SET_SIZE = 18;

const photo = (n: number) => `/media/examples/listing/${String(n).padStart(2, "0")}.jpg`;

/**
 * As many example photographs as the package actually delivers.
 *
 * The count a visitor reads in the heading and the number of photographs they
 * can then page through are the same value, taken from the package itself.
 *
 * Capped at the size of the set we have. Premiere promises 25, so a landing
 * page for it needs more example photographs shot before it can claim the
 * count honestly.
 */
export function listingPhotos(packageId: string): string[] {
  const pkg = LISTING_PACKAGES.find((p) => p.id === packageId);
  const count = Math.min(pkg?.photos ?? SET_SIZE, SET_SIZE);
  return Array.from({ length: count }, (_, i) => photo(i + 1));
}
