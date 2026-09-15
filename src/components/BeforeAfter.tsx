"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/**
 * Before-and-after wipe.
 *
 * Both images are stacked at the same size and the top one is clipped, rather
 * than resized, so the two halves stay in register as the handle moves. That
 * only holds if the files themselves are identical dimensions, which is why the
 * pairs are exported to a fixed size rather than at their source resolutions.
 *
 * The handle is a real range input: dragging it works, and so do arrow keys and
 * a screen reader, without writing any of that by hand.
 */
export default function BeforeAfter({
  before,
  after,
  alt,
  caption,
  priority = false,
}: {
  before: string;
  after: string;
  alt: string;
  caption?: string;
  /** Set on the first one so it isn't lazy-loaded below a fold it's above. */
  priority?: boolean;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);

  /* Dragging anywhere on the image, not just the handle, is what people try
     first. Pointer events cover mouse, touch and pen in one path. */
  const track = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    const next = ((clientX - box.left) / box.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <figure>
      <div
        ref={frame}
        className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl bg-re-stone-light select-none touch-pan-y"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          track(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") track(e.clientX);
        }}
      >
        <Image
          src={after}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          priority={priority}
          className="object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            priority={priority}
            className="object-cover"
            draggable={false}
          />
        </div>

        {/* Labels sit on the half they describe and fade out as it closes, so
            neither one ends up floating over the wrong image. */}
        <span
          className="pointer-events-none absolute left-4 top-4 rounded-full bg-re-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white transition-opacity duration-200"
          style={{ opacity: pos > 18 ? 1 : 0 }}
        >
          Before
        </span>
        <span
          className="pointer-events-none absolute right-4 top-4 rounded-full bg-re-blue/85 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white transition-opacity duration-200"
          style={{ opacity: pos < 82 ? 1 : 0 }}
        >
          Staged
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.45)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-re-blue shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <polyline points="14 7 19 12 14 17" />
              <polyline points="10 7 5 12 10 17" />
            </svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${alt}. Drag to compare before and after staging.`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-re-stone">{caption}</figcaption>
      )}
    </figure>
  );
}
