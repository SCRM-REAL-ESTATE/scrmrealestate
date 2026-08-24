"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { mediaByCategory, mediaUrl, toLightboxItem, type MediaItem } from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";
import { useCentredCarousel } from "@/lib/useCentredCarousel";

/** Plays only while on screen, so the page doesn't fetch every clip at once. */
function ReelVideo({ item }: { item: MediaItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={mediaUrl(item.src)}
      poster={item.poster ? mediaUrl(item.poster) : undefined}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      muted
      loop
      playsInline
      preload="none"
    />
  );
}

/**
 * The video work, front and centre on the home page. Vertical clips play
 * silently in a row; clicking one opens it full screen with sound.
 */
export default function HomeVideoReel() {
  // Listing video only. Brand, team and testimonial clips are agency work and
  // belong with the agency offer, not here. Room for five across; the row
  // centres itself, so it stays balanced until a fifth clip is uploaded.
  const items = useMemo(
    () => mediaByCategory("vertical").filter((i) => i.type === "video").slice(0, 5),
    []
  );

  const [lightbox, setLightbox] = useState<LightboxState>(null);

  // Opens mid-row on mobile, so there is work to flick to on both sides.
  const trackRef = useCentredCarousel<HTMLDivElement>(Math.floor(items.length / 2));

  if (items.length === 0) return null;

  return (
    <>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 md:gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0"
      >
        {items.map((item, idx) => (
          <motion.button
            key={item.src}
            type="button"
            onClick={() => setLightbox({ items: items.map(toLightboxItem), index: idx })}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.07, 0.4), ease: [0.22, 1, 0.36, 1] }}
            aria-label="Play video"
            className="group relative aspect-[9/16] w-[72%] shrink-0 snap-center overflow-hidden rounded-2xl bg-re-stone-light sm:w-[46%] md:w-[calc(20%-0.8rem)]"
          >
            <ReelVideo item={item} />
            <span className="pointer-events-none absolute inset-0 flex items-end p-3 md:p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 1.5l11 6.5-11 6.5z" />
                </svg>
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
