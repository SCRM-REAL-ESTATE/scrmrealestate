"use client";

import Link from "next/link";
import { useState } from "react";
import { VACANT_PROPERTY } from "@/lib/pricing";

/**
 * Offered next to the listing packages, because the property being empty is
 * something you know before booking the shoot. Opens in place rather than
 * over the page, so the packages stay visible while comparing.
 */
export default function PairsWellWith() {
  const [open, setOpen] = useState(false);
  const pack = VACANT_PROPERTY.options.find((o) => o.featured) ?? VACANT_PROPERTY.options[0];

  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-3 rounded-full border border-re-stone-light bg-white px-7 py-3.5 text-xs tracking-[0.2em] uppercase text-re-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-re-blue hover:text-re-blue"
        >
          {open ? "Hide" : "Pairs well with"}
          <span
            aria-hidden
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-re-stone-light transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>
      </div>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`mx-auto mt-8 max-w-xl rounded-[1.75rem] border border-re-stone-light bg-white p-8 text-center transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <p className="label-eyebrow">{pack.name}</p>
            <p className="mt-4 font-serif text-5xl text-re-ink">
              {pack.price}
            </p>
            <ul className="mt-6 mx-auto inline-block space-y-2 text-left text-sm text-re-ink">
              {pack.includes.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-re-blue-accent" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
            {pack.note && <p className="mt-4 text-sm text-re-stone">{pack.note}</p>}
            <div className="mt-7">
              <Link
                href="#vacant-property"
                onClick={() => setOpen(false)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-re-blue hover:text-re-blue-accent transition-colors"
              >
                See vacant property
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
