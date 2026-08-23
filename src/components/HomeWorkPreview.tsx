"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Stagger, StaggerChild } from "./Reveal";
import { mediaByCategory, mediaUrl, toLightboxItem } from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";

/**
 * The eight listing photos on the home page. Click one and it opens full
 * screen with arrows to flick through the set and an X to close — same
 * lightbox as the Work gallery.
 */
export default function HomeWorkPreview() {
  const items = useMemo(
    () => mediaByCategory("listing").filter((i) => i.type === "image").slice(0, 8),
    []
  );
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  if (items.length === 0) return null;

  return (
    <>
      <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" staggerChildren={0.05}>
        {items.map((item, idx) => (
          <StaggerChild key={item.src}>
            <button
              type="button"
              onClick={() => setLightbox({ items: items.map(toLightboxItem), index: idx })}
              aria-label="Open image preview"
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-re-stone-light group cursor-pointer block"
            >
              <Image
                src={mediaUrl(item.src)}
                alt={item.alt ?? "Listing photography"}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-re-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </button>
          </StaggerChild>
        ))}
      </Stagger>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
