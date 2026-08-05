"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEDIA_ITEMS, aspectRatio, mediaUrl, type MediaCategory, type MediaItem } from "@/lib/media";
import Lightbox, { type LightboxItem } from "./VideoLightbox";

type Filter = "all" | MediaCategory;

const categories: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "listing", label: "Listing Photography" },
  { id: "vertical", label: "Vertical Video" },
  { id: "landscape", label: "Listing Video" },
  { id: "agency", label: "Brand & Team" },
];

/** Tiles rendered before the "Load more" button appears. */
const PAGE_SIZE = 24;

/**
 * Grid videos play only while on screen — a large library would otherwise
 * download every clip at once the moment the page loads.
 */
function GalleryVideo({ item }: { item: MediaItem }) {
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
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      muted
      loop
      playsInline
      preload="none"
    />
  );
}

export default function WorkGallery() {
  const [active, setActive] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);

  const filtered = useMemo(() => {
    if (active === "all") return MEDIA_ITEMS;
    return MEDIA_ITEMS.filter((i) => i.category === active);
  }, [active]);

  const shown = filtered.slice(0, visible);

  const selectCategory = (id: Filter) => {
    setActive(id);
    setVisible(PAGE_SIZE);
  };

  const openItem = (item: MediaItem) => {
    setLightbox(
      item.type === "video"
        ? { type: "video", src: mediaUrl(item.src), aspect: aspectRatio(item) < 1 ? "9/16" : "16/9" }
        : { type: "image", src: mediaUrl(item.src), alt: item.alt }
    );
  };

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-[var(--shell-h)] z-20 bg-re-ivory/95 backdrop-blur-sm border-b border-re-stone-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar py-4">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectCategory(c.id)}
                  className={`shrink-0 px-4 md:px-5 py-2.5 text-xs tracking-[0.16em] uppercase border transition-colors min-h-[40px] ${
                    isActive
                      ? "bg-re-blue text-white border-re-blue"
                      : "bg-transparent text-re-ink border-re-stone-light hover:border-re-blue"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry-style gallery */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
            <AnimatePresence mode="popLayout">
              {shown.map((item, idx) => (
                <motion.button
                  type="button"
                  key={`${item.src}-${idx}`}
                  onClick={() => openItem(item)}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min((idx % PAGE_SIZE) * 0.03, 0.4) }}
                  style={{ aspectRatio: aspectRatio(item) }}
                  className="group mb-3 md:mb-4 break-inside-avoid relative overflow-hidden bg-re-stone-light w-full cursor-pointer block"
                  aria-label={`Open ${item.type === "video" ? "video" : "image"} preview`}
                >
                  {item.type === "image" ? (
                    <Image
                      src={mediaUrl(item.src)}
                      alt={item.alt ?? "Real estate work"}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <GalleryVideo item={item} />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-re-ink/55 via-re-ink/0 to-re-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Play indicator for videos */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="inline-flex items-center gap-2 text-white text-xs tracking-[0.2em] uppercase">
                        <span className="inline-flex h-9 w-9 items-center justify-center border border-white/70 bg-black/30 backdrop-blur-sm">
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3 1.5l11 6.5-11 6.5z" />
                          </svg>
                        </span>
                        Play
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-8 py-4 text-xs tracking-[0.2em] uppercase border border-re-stone-light text-re-ink hover:border-re-blue hover:text-re-blue transition-colors"
              >
                Load more ({filtered.length - visible})
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-center text-re-stone py-20">No work in this category yet.</p>
          )}
        </div>
      </section>

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
