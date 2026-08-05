"use client";

import { useState } from "react";
import { mediaByCategory, toLightboxItem, type MediaCategory } from "@/lib/media";
import Lightbox, { type LightboxState } from "./VideoLightbox";

export type IncludeItem = {
  label: string;
  /** Categories to pull examples from. A line with none is plain text. */
  examples?: MediaCategory[];
};

/**
 * Deliverables that show their own work. "8 social media videos per month"
 * means more when you can open it and watch eight of them.
 */
export default function ServiceIncludes({
  items,
  light = false,
}: {
  items: IncludeItem[];
  light?: boolean;
}) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  return (
    <>
      <ul className={`mt-3 space-y-2 text-sm ${light ? "text-white/90" : "text-re-ink"}`}>
        {items.map((item) => {
          const examples = item.examples ? mediaByCategory(...item.examples) : [];

          return (
            <li key={item.label} className="flex gap-3">
              <span className={`mt-2 h-1 w-3 shrink-0 ${light ? "bg-white/60" : "bg-re-blue-accent"}`} />
              {examples.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setLightbox({ items: examples.map(toLightboxItem), index: 0 })}
                  className="group text-left"
                >
                  <span className={`underline decoration-dotted underline-offset-4 ${light ? "decoration-white/40 group-hover:decoration-white" : "decoration-re-blue-accent/50 group-hover:decoration-re-blue-accent"} transition-colors`}>
                    {item.label}
                  </span>
                  <span className={`ml-2 whitespace-nowrap text-xs tracking-[0.14em] uppercase ${light ? "text-white/60 group-hover:text-white" : "text-re-blue-accent group-hover:text-re-blue"} transition-colors`}>
                    See {examples.length} example{examples.length === 1 ? "" : "s"}
                    <span aria-hidden className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </button>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ul>

      <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
