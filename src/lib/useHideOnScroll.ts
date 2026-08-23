"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Chrome that gets out of the way: hidden while scrolling down past the hero,
 * back the moment you scroll up. TopBar and Header share this so they move
 * as one unit.
 */
export function useHideOnScroll(threshold = 160) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (y < threshold) {
        setHidden(false);
      } else if (dy > 6) {
        setHidden(true);
      } else if (dy < -6) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
