"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export default function FAQAccordion({
  items,
  light = true,
}: {
  items: Item[];
  light?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-white/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="py-2">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full flex items-center justify-between gap-4 py-5 text-left ${
                light ? "text-white" : "text-re-ink"
              }`}
              aria-expanded={isOpen}
            >
              <span className="font-serif text-xl md:text-2xl leading-snug">{item.q}</span>
              <span
                className={`flex-shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-full border ${
                  light ? "border-white/40" : "border-re-stone-light"
                } transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className={`pb-6 pr-12 leading-relaxed ${light ? "text-white/85" : "text-re-stone"}`}>
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
