"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export type LightboxItem =
  | { type: "video"; src: string; poster?: string; aspect?: "9/16" | "16/9" | string }
  | { type: "image"; src: string; alt?: string };

/**
 * Opens a set of items at a given index — used both by the gallery and by the
 * "see examples" links on Services. Single-item callers pass a one-item array;
 * the arrows and counter hide themselves.
 */
export type LightboxState = { items: LightboxItem[]; index: number } | null;

export default function Lightbox({
  state,
  onClose,
}: {
  state: LightboxState;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  const items = state?.items ?? [];
  const item = items[index];
  const many = items.length > 1;

  useEffect(() => {
    if (state) setIndex(state.index);
  }, [state]);

  const step = useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state, onClose, step]);

  // Auto-play with audio when a video opens
  useEffect(() => {
    if (item?.type === "video" && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Some browsers block unmuted autoplay; fall back to muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [item]);

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Media preview"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 md:top-7 md:right-7 inline-flex items-center justify-center h-12 w-12 rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors z-10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          {many && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className={`${arrowClass} left-3 md:left-6`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <polyline points="15 5 8 12 15 19" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className={`${arrowClass} right-3 md:right-6`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <polyline points="9 5 16 12 9 19" />
                </svg>
              </button>

              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-[0.2em] uppercase">
                {index + 1} / {items.length}
              </span>
            </>
          )}

          <motion.div
            key={item.src}
            className="relative max-h-[90vh] max-w-[95vw] flex items-center justify-center"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === "video" ? (
              <video
                ref={videoRef}
                src={item.src}
                poster={item.poster}
                controls
                playsInline
                className={`max-h-[90vh] max-w-[95vw] bg-black rounded-2xl ${
                  item.aspect === "9/16" ? "aspect-[9/16] w-auto" : ""
                }`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt ?? ""}
                className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
