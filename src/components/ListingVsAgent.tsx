"use client";

import { useState } from "react";
import InViewVideo from "./InViewVideo";
import Lightbox, { type LightboxState } from "./VideoLightbox";
import { mediaByCategory, mediaUrl, toLightboxItem } from "@/lib/media";

/**
 * The two videos that come out of one Signature shoot, side by side. The
 * point of the section is the contrast, so both play at once rather than
 * sitting behind a tab.
 */
const listing = mediaByCategory("landscape").find((item) => item.type === "video");
const agent = mediaByCategory("agency").find((item) => item.type === "video");

const PANELS = [
  {
    item: listing,
    aspect: "aspect-video",
    label: "The listing video",
    line: "Sells the property. Lives on the portals. Gone the week it settles.",
  },
  {
    item: agent,
    aspect: "aspect-[9/16] max-w-[260px] mx-auto",
    label: "The agent video",
    line: "Sells you. Lives on your feed. Still working on you next year.",
  },
];

export default function ListingVsAgent() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-end">
        {PANELS.map(({ item, aspect, label, line }) => (
          <div key={label}>
            <button
              type="button"
              onClick={() => item && setLightbox({ items: [toLightboxItem(item)], index: 0 })}
              aria-label={`Play ${label.toLowerCase()} with sound`}
              className={`group relative block w-full overflow-hidden rounded-2xl bg-re-stone-light ${aspect}`}
            >
              {item && (
                <InViewVideo
                  src={mediaUrl(item.src)}
                  poster={item.poster ? mediaUrl(item.poster) : undefined}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-re-ink/50 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M3 1.5l11 6.5-11 6.5z" />
                </svg>
              </span>
            </button>
            <p className="mt-5 font-serif text-xl text-re-ink">{label}</p>
            <p className="mt-2 text-re-stone leading-relaxed">{line}</p>
          </div>
        ))}
      </div>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
