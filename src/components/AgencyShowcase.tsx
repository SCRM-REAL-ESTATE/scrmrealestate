"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  mediaByCategory,
  mediaSets,
  mediaUrl,
  toLightboxItem,
  type MediaItem,
} from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";

function TileVideo({ item }: { item: MediaItem }) {
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

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl text-re-ink">{label}</h3>
        <p className="text-sm text-re-stone">{hint}</p>
      </div>
      {/* Flex, not grid: a row with only two sets in it stays centred. */}
      <div className="mt-5 flex flex-wrap justify-center gap-3 md:gap-5">{children}</div>
    </div>
  );
}

const tileClass =
  "group relative overflow-hidden rounded-2xl bg-re-stone-light cursor-pointer block transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(30,98,224,0.16)] w-[calc(33.333%-0.5rem)] md:w-[calc(33.333%-0.834rem)]";

/**
 * What an agency actually receives each month, shown rather than described:
 * three videos, three carousel posts you can flick through, three stories.
 */
export default function AgencyShowcase() {
  const videos = useMemo(
    () =>
      [
        ...mediaByCategory("agency").filter((i) => i.type === "video"),
        ...mediaByCategory("testimonial").filter((i) => i.type === "video"),
      ].slice(0, 3),
    []
  );
  const carousels = useMemo(() => mediaSets("carousel").slice(0, 3), []);
  const stories = useMemo(() => mediaByCategory("detail").slice(0, 3), []);

  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay: Math.min(i * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-14 md:space-y-16">
        {videos.length > 0 && (
          <Row label="Videos" hint="Tap to play with sound">
            {videos.map((item, i) => (
              <motion.button
                key={item.src}
                type="button"
                {...fade(i)}
                onClick={() => setLightbox({ items: videos.map(toLightboxItem), index: i })}
                aria-label="Play video"
                className={`${tileClass} aspect-[9/16]`}
              >
                <TileVideo item={item} />
                <span className="pointer-events-none absolute inset-0 flex items-end p-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3 1.5l11 6.5-11 6.5z" />
                    </svg>
                  </span>
                </span>
              </motion.button>
            ))}
          </Row>
        )}

        {carousels.length > 0 && (
          <Row label="Carousel posts" hint="Tap to flick through the slides">
            {carousels.map((set, i) => (
              <motion.button
                key={set.key}
                type="button"
                {...fade(i)}
                onClick={() => setLightbox({ items: set.items.map(toLightboxItem), index: 0 })}
                aria-label={`Open carousel, ${set.items.length} slides`}
                className={`${tileClass} aspect-[4/5]`}
              >
                <Image
                  src={mediaUrl(set.cover.src)}
                  alt={set.cover.alt ?? "Carousel post"}
                  fill
                  sizes="(min-width: 768px) 30vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] tracking-wide text-white backdrop-blur-sm">
                  {set.items.length} slides
                </span>
              </motion.button>
            ))}
          </Row>
        )}

        {stories.length > 0 && (
          <Row label="Stories" hint="Tap to open">
            {stories.map((item, i) => (
              <motion.button
                key={item.src}
                type="button"
                {...fade(i)}
                onClick={() => setLightbox({ items: stories.map(toLightboxItem), index: i })}
                aria-label="Open story"
                className={`${tileClass} aspect-[9/16]`}
              >
                <Image
                  src={mediaUrl(item.src)}
                  alt={item.alt ?? "Story frame"}
                  fill
                  sizes="(min-width: 768px) 30vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </motion.button>
            ))}
          </Row>
        )}
      </div>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
