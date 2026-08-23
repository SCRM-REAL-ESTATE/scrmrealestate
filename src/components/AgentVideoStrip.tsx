"use client";

import { useState } from "react";
import InViewVideo from "./InViewVideo";
import Lightbox, { type LightboxState } from "./VideoLightbox";
import { mediaByCategory, mediaUrl, toLightboxItem } from "@/lib/media";

/**
 * Real agent-led verticals from the library. This is the proof the whole
 * agents page rests on, so it plays muted in the grid and opens with sound.
 */
const AGENT_VIDEOS = mediaByCategory("agency").filter((item) => item.type === "video");

export default function AgentVideoStrip() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const items = AGENT_VIDEOS.map(toLightboxItem);

  return (
    <>
      <ul className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible gap-4">
        {AGENT_VIDEOS.map((item, i) => (
          <li key={item.src} className="snap-center shrink-0 w-[62%] sm:w-[40%] md:w-auto">
            <button
              type="button"
              onClick={() => setLightbox({ items, index: i })}
              aria-label="Play agent video with sound"
              className="group relative block w-full aspect-[9/16] overflow-hidden rounded-2xl bg-re-stone-light"
            >
              <InViewVideo
                src={mediaUrl(item.src)}
                poster={item.poster ? mediaUrl(item.poster) : undefined}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-re-ink/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M3 1.5l11 6.5-11 6.5z" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
