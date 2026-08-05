"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CATEGORY_LABELS,
  MEDIA_ITEMS,
  aspectRatio,
  isPortrait,
  mediaUrl,
  populatedCategories,
  toLightboxItem,
  type MediaCategory,
  type MediaItem,
} from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";

type Filter = "all" | MediaCategory;

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

/** Always visible on video tiles — video should read as video at a glance. */
function PlayBadge() {
  return (
    <div className="absolute inset-0 flex items-end p-4 md:p-5 pointer-events-none">
      <span className="inline-flex items-center gap-2.5 text-white text-xs tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        <span className="inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center border border-white/70 bg-black/35 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 1.5l11 6.5-11 6.5z" />
          </svg>
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Play</span>
      </span>
    </div>
  );
}

function Tile({
  item,
  index,
  onOpen,
  className = "",
}: {
  item: MediaItem;
  index: number;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min((index % PAGE_SIZE) * 0.03, 0.4) }}
      style={{ aspectRatio: aspectRatio(item) }}
      className={`group relative overflow-hidden bg-re-stone-light w-full cursor-pointer block ${className}`}
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

      <div className="absolute inset-0 bg-gradient-to-t from-re-ink/55 via-re-ink/0 to-re-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {item.type === "video" && <PlayBadge />}
    </motion.button>
  );
}

export default function WorkGallery() {
  const [active, setActive] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const filters: { id: Filter; label: string }[] = useMemo(
    () => [
      { id: "all" as Filter, label: "All" },
      ...populatedCategories().map((id) => ({ id: id as Filter, label: CATEGORY_LABELS[id] })),
    ],
    []
  );

  /** Video leads — it's the work that sells, and it's what people scan for. */
  const filtered = useMemo(() => {
    const items = active === "all" ? MEDIA_ITEMS : MEDIA_ITEMS.filter((i) => i.category === active);
    return [...items].sort((a, b) => (a.type === b.type ? 0 : a.type === "video" ? -1 : 1));
  }, [active]);

  const shown = filtered.slice(0, visible);
  const videos = shown.filter((i) => i.type === "video");
  const photos = shown.filter((i) => i.type === "image");

  const selectFilter = (id: Filter) => {
    setActive(id);
    setVisible(PAGE_SIZE);
  };

  /** Arrows in the lightbox walk the whole filtered set, not just one section. */
  const openItem = (item: MediaItem) => {
    setLightbox({
      items: filtered.map(toLightboxItem),
      index: filtered.indexOf(item),
    });
  };

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-[var(--shell-h)] z-20 bg-re-ivory/95 backdrop-blur-sm border-b border-re-stone-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar py-4">
            {filters.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectFilter(c.id)}
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

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* VIDEO — large tiles. Landscape takes half a row, vertical a third. */}
          {videos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 [grid-auto-flow:dense] items-start">
              <AnimatePresence mode="popLayout">
                {videos.map((item, idx) => (
                  <Tile
                    key={item.src}
                    item={item}
                    index={idx}
                    onOpen={() => openItem(item)}
                    className={isPortrait(item) ? "col-span-1 md:col-span-2" : "col-span-2 md:col-span-3"}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* PHOTOGRAPHY — masonry underneath */}
          {photos.length > 0 && (
            <div className={videos.length > 0 ? "mt-10 md:mt-14" : ""}>
              {videos.length > 0 && active === "all" && (
                <p className="label-eyebrow mb-5">Photography</p>
              )}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
                <AnimatePresence mode="popLayout">
                  {photos.map((item, idx) => (
                    <div key={item.src} className="mb-3 md:mb-4 break-inside-avoid">
                      <Tile item={item} index={idx} onOpen={() => openItem(item)} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

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

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
