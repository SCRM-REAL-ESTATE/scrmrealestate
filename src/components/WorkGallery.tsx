"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GALLERY_FILTERS,
  allMontageItems,
  aspectRatio,
  mediaByCategory,
  mediaSets,
  mediaUrl,
  populatedFilters,
  toLightboxItem,
  type GalleryFilter,
  type MediaItem,
} from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";

type TabId = "all" | GalleryFilter["id"];

/** Tiles rendered before the "Load more" button appears. */
const PAGE_SIZE = 28;

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
    <div className="absolute inset-0 flex items-end p-3 md:p-4 pointer-events-none">
      <span className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-re-ink drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 1.5l11 6.5-11 6.5z" />
        </svg>
      </span>
    </div>
  );
}

function Tile({
  item,
  index,
  onOpen,
  badge,
  ratio,
}: {
  item: MediaItem;
  index: number;
  onOpen: () => void;
  badge?: string;
  /** Overrides the item's own shape — used for the wide feature band. */
  ratio?: number;
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
      style={{ aspectRatio: ratio ?? aspectRatio(item) }}
      className="group relative overflow-hidden rounded-2xl bg-re-stone-light w-full cursor-pointer block"
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

      {badge && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 text-white text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 backdrop-blur-sm pointer-events-none">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="1.5" y="4.5" width="10" height="10" />
            <path d="M4.5 4.5v-3h10v10h-3" />
          </svg>
          {badge}
        </span>
      )}
    </motion.button>
  );
}

export default function WorkGallery() {
  const [active, setActive] = useState<TabId>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const tabs: { id: TabId; label: string }[] = useMemo(
    () => [{ id: "all" as TabId, label: "All" }, ...populatedFilters().map((f) => ({ id: f.id as TabId, label: f.label }))],
    []
  );

  const activeFilter = active === "all" ? null : GALLERY_FILTERS.find((f) => f.id === active);
  const isGrouped = Boolean(activeFilter?.grouped);

  /** Everything the current tab shows, in display order. */
  const items = useMemo(() => {
    if (active === "all") return allMontageItems();
    if (!activeFilter || activeFilter.grouped) return []; // grouped tabs render sets below
    return mediaByCategory(...activeFilter.categories);
  }, [active, activeFilter]);

  const sets = useMemo(
    () => (activeFilter?.grouped ? mediaSets(...activeFilter.categories) : []),
    [activeFilter]
  );
  const shown = items.slice(0, visible);

  const selectTab = (id: TabId) => {
    setActive(id);
    setVisible(PAGE_SIZE);
  };

  /** Arrows in the lightbox walk the whole tab, not just what's loaded. */
  const openItem = (item: MediaItem) => {
    setLightbox({ items: items.map(toLightboxItem), index: items.indexOf(item) });
  };

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-[var(--shell-h)] z-20 bg-re-ivory/95 backdrop-blur-sm border-b border-re-stone-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar py-4">
            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTab(t.id)}
                  className={`shrink-0 px-5 py-2.5 text-xs tracking-[0.16em] uppercase border rounded-full transition-all duration-300 min-h-[40px] ${
                    isActive
                      ? "bg-re-blue text-white border-re-blue shadow-[0_6px_20px_rgba(28,58,94,0.25)]"
                      : "bg-transparent text-re-ink border-re-stone-light hover:border-re-blue hover:-translate-y-0.5"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {isGrouped ? (
            /* One tile per post/ad — click steps through its files in order */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-start">
              <AnimatePresence mode="popLayout">
                {sets.map((set, idx) => (
                  <Tile
                    key={set.key}
                    item={set.cover}
                    index={idx}
                    badge={
                      set.items.length > 1
                        ? `${set.items.length} ${active === "ads" ? "versions" : "slides"}`
                        : undefined
                    }
                    onOpen={() => setLightbox({ items: set.items.map(toLightboxItem), index: 0 })}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Masonry montage — photos and videos share the same columns */
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
              <AnimatePresence mode="popLayout">
                {shown.map((item, idx) => (
                  <div key={item.src} className="mb-3 md:mb-4 break-inside-avoid">
                    <Tile item={item} index={idx} onOpen={() => openItem(item)} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isGrouped && visible < items.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-8 py-4 text-xs tracking-[0.2em] uppercase border rounded-full border-re-stone-light text-re-ink hover:border-re-blue hover:text-re-blue hover:-translate-y-0.5 transition-all duration-300"
              >
                Load more ({items.length - visible})
              </button>
            </div>
          )}

          {((isGrouped && sets.length === 0) || (!isGrouped && items.length === 0)) && (
            <p className="text-center text-re-stone py-20">No work in this category yet.</p>
          )}
        </div>
      </section>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
