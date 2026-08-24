"use client";

import { useState } from "react";
import { CTAButton } from "./ui";
import { Stagger, StaggerChild } from "./Reveal";
import TiltCard from "./TiltCard";
import { LISTING_PACKAGES } from "@/lib/pricing";
import { useCentredCarousel } from "@/lib/useCentredCarousel";

/**
 * The three listing packages as individual cards. Shared by the home page and
 * Services so the two can never show different inclusions. Inclusions sit
 * behind a "What's included" toggle so the three cards stay short on screen.
 */
export default function ListingPackages({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<string | null>(null);

  // On mobile the row opens on the featured package rather than the cheapest,
  // so the one most people take is the one they land on.
  const featuredIndex = Math.max(
    LISTING_PACKAGES.findIndex((p) => p.featured),
    0
  );
  const trackRef = useCentredCarousel<HTMLDivElement>(featuredIndex);

  return (
    <Stagger
      ref={trackRef}
      className={`flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2 md:pb-0 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible gap-6 md:gap-8 items-stretch md:items-start ${className}`}
      staggerChildren={0.1}
    >
      {LISTING_PACKAGES.map((pkg) => {
        const isOpen = open === pkg.name;
        return (
          <StaggerChild key={pkg.name} className="snap-center shrink-0 w-[86%] sm:w-[64%] md:w-auto">
            <TiltCard
              className={`gold-ring relative flex flex-col h-full p-8 md:p-9 rounded-[1.75rem] border transition-shadow duration-500 ${
                pkg.featured
                  ? "blue-fade text-white border-re-blue hover:shadow-[0_30px_70px_rgba(30,98,224,0.35)]"
                  : "bg-white border-re-stone-light hover:shadow-[0_30px_70px_rgba(30,98,224,0.12)]"
              }`}
            >
              {pkg.featured && (
                <span className="gold-chrome-bg self-start rounded-full text-re-ink text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 mb-5 shadow-[0_4px_14px_rgba(196,169,108,0.4)]">
                  Most Popular
                </span>
              )}

              <p className={`label-eyebrow ${pkg.featured ? "!text-white/85" : ""}`}>{pkg.name}</p>
              <p className={`mt-3 font-serif text-5xl ${pkg.featured ? "text-white" : "text-re-ink"}`}>
                {pkg.price}
              </p>
              <p className={`mt-3 text-sm ${pkg.featured ? "text-white/85" : "text-re-stone"}`}>
                {pkg.products} · {pkg.turnaround}
              </p>

              <p
                className={`mt-6 pt-5 border-t font-serif text-lg leading-snug ${
                  pkg.featured ? "border-white/20 text-white" : "border-re-stone-light text-re-ink"
                }`}
              >
                {pkg.note}
              </p>

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : pkg.name)}
                aria-expanded={isOpen}
                className={`mt-6 w-full flex items-center justify-between gap-3 rounded-full border px-5 py-3 text-xs tracking-[0.16em] uppercase transition-colors duration-300 ${
                  pkg.featured
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-re-stone-light text-re-ink hover:border-re-blue hover:text-re-blue"
                }`}
              >
                <span>What&apos;s included</span>
                <span
                  aria-hidden
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-300 ${
                    pkg.featured ? "border-white/40" : "border-re-stone-light"
                  } ${isOpen ? "rotate-45" : ""}`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
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
                  <ul className={`pt-6 space-y-3 text-sm ${pkg.featured ? "text-white/90" : "text-re-ink"}`}>
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex gap-3">
                        <span className={`mt-2 h-1 w-3 shrink-0 rounded-full ${pkg.featured ? "bg-white/60" : "bg-re-blue-accent"}`} />
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex-grow flex items-end">
                <CTAButton href="/contact" variant={pkg.featured ? "outline-light" : "solid"}>
                  Book this package
                </CTAButton>
              </div>
            </TiltCard>
          </StaggerChild>
        );
      })}
    </Stagger>
  );
}
