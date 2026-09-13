"use client";

import Image from "next/image";
import { useState } from "react";
import { Stagger, StaggerChild } from "./Reveal";
import Lightbox, { type LightboxState } from "./VideoLightbox";

/**
 * The delivered photo set, openable.
 *
 * A grid of eighteen thumbnails proves the count but is too small to judge the
 * work by, which is the whole point of showing it on an ad page. Clicking any
 * tile opens the full set in the lightbox, where arrows, keys and a swipe step
 * through it.
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

  return (
    <>
      <Stagger
        className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3"
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
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
