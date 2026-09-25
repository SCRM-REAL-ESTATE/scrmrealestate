"use client";

import Image from "next/image";
import { useState } from "react";
import { Stagger, StaggerChild } from "./Reveal";
import Lightbox, { type LightboxState } from "./VideoLightbox";

/**
 * The delivered photo set, openable.
 *
 * Two presentations of the same thing. On a wide screen every photograph is a
 * tile, because the whole set at once is the proof. On a phone that grid
 * becomes a page of postage stamps, so it collapses to a single fanned stack
 * that reads as a pile of photographs and opens the same lightbox — where
 * arrows, keys and a swipe step through the set.
 *
 * The count comes from the caller: each package landing page passes as many
 * photographs as that package delivers.
 */
export default function ListingPhotoGrid({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const open = (index: number) =>
    setLightbox({
      items: photos.map((src, i) => ({
        type: "image" as const,
        src,
        alt: `Listing photograph ${i + 1} of ${photos.length}`,
      })),
      index,
    });

  /* The three on top of the pile. Any three would do; these are the first
     three so the stack opens on the same frame the lightbox does. */
  const [top, second, third] = photos;

  /* Enough columns to come out even. Eighteen photographs in sixes and fifteen
     in fives both end on a full row; either count in the other grid leaves a
     short row that reads as a set with pieces missing. Both class names are
     written out because Tailwind reads the source, not the expression. */
  const columns = photos.length % 6 === 0 ? "lg:grid-cols-6" : "lg:grid-cols-5";

  return (
    <>
      {/* Phone: one pile of photographs */}
      <button
        type="button"
        onClick={() => open(0)}
        aria-label={`Open all ${photos.length} photographs`}
        className="group mt-8 block w-full cursor-pointer md:hidden"
      >
        {/* Padding so the fanned corners aren't clipped by the button box. */}
        <div className="relative mx-auto aspect-[3/2] w-[84%] px-1">
          <span className="absolute inset-0 -rotate-6 overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_rgba(26,26,26,0.18)]">
            <Image src={third} alt="" fill sizes="84vw" quality={70} className="object-cover" />
          </span>
          <span className="absolute inset-0 rotate-3 overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_rgba(26,26,26,0.18)]">
            <Image src={second} alt="" fill sizes="84vw" quality={70} className="object-cover" />
          </span>
          <span className="absolute inset-0 overflow-hidden rounded-xl bg-white shadow-[0_14px_36px_rgba(26,26,26,0.22)] transition-transform duration-300 group-active:scale-[0.98]">
            <Image
              src={top}
              alt={`Listing photograph 1 of ${photos.length}`}
              fill
              sizes="84vw"
              quality={85}
              className="object-cover"
            />
          </span>
        </div>

        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-re-blue px-5 py-2.5 text-sm text-white">
          View all {photos.length} photos
          <span aria-hidden>→</span>
        </span>
      </button>

      {/* Wide: every photograph at once */}
      <Stagger
        className={`mt-8 hidden gap-2.5 md:grid md:grid-cols-3 ${columns} md:gap-3`}
        staggerChildren={0.03}
      >
        {photos.map((src, i) => (
          <StaggerChild key={src}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open photograph ${i + 1} of ${photos.length}`}
              className="group relative block w-full overflow-hidden rounded-xl cursor-zoom-in"
            >
              <Image
                src={src}
                alt={`Listing photograph ${i + 1} of ${photos.length}`}
                width={1600}
                height={1068}
                sizes="(max-width: 1024px) 33vw, 20vw"
                quality={85}
                className="block w-full h-full object-cover aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-re-ink/0 transition-colors duration-300 group-hover:bg-re-ink/10" />
            </button>
          </StaggerChild>
        ))}
      </Stagger>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
