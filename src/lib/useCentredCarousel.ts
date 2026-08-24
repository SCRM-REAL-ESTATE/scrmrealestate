"use client";

import { useEffect, useRef } from "react";

/**
 * Opens a horizontal snap carousel on the card at `index` rather than the
 * first one, so the tile worth seeing is the one already on screen and the
 * others are a flick away in either direction.
 *
 * Only acts where the track actually scrolls, which is the mobile layout.
 * On desktop the same markup lays out as a full row, so this is inert.
 */
export function useCentredCarousel<T extends HTMLElement>(index: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const track = ref.current;
    if (!track || index <= 0) return;

    // Wait for layout, otherwise offsets are all still zero.
    const frame = requestAnimationFrame(() => {
      if (track.scrollWidth <= track.clientWidth + 8) return;
      const card = track.children[index] as HTMLElement | undefined;
      if (!card) return;
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    });

    return () => cancelAnimationFrame(frame);
  }, [index]);

  return ref;
}
