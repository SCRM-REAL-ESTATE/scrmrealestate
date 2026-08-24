"use client";

import { useEffect, useState } from "react";

/**
 * Chrome that shows only at the top of the page. Once you have scrolled past
 * the threshold it stays out of the way for the whole page, however you move,
 * and comes back when you return to the top.
 *
 * Deliberately not direction-aware: reappearing on any upward flick meant the
 * header kept landing on top of whatever you had just scrolled back to read.
 */
export function useHideOnScroll(threshold = 120) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
