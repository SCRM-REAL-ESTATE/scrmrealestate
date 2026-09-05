"use client";

import { CTAButton } from "./ui";
import { Stagger, StaggerChild } from "./Reveal";
import TiltCard from "./TiltCard";
import { LISTING_PACKAGES, type ListingPackage } from "@/lib/pricing";
import { useCentredCarousel } from "@/lib/useCentredCarousel";

/**
 * The three listing packages as individual cards. Shared by the home page and
 * Services so the two can never show different inclusions. Everything is on the
 * face of the card: the tiers only make sense next to each other, and a toggle
 * meant nobody compared them.
 */
export default function ListingPackages({
  className = "",
  packages = LISTING_PACKAGES,
}: {
  className?: string;
  /** Commercial passes its own two tiers; residential takes the default three. */
  packages?: ListingPackage[];
}) {
  // On mobile the row opens on the featured package rather than the cheapest,
  // so the one most people take is the one they land on.
  const featuredIndex = Math.max(
    packages.findIndex((p) => p.featured),
    0
  );
  const trackRef = useCentredCarousel<HTMLDivElement>(featuredIndex);

  return (
    <Stagger
      ref={trackRef}
      className={`flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2 md:pb-0 md:mx-0 md:px-0 ${packages.length === 2 ? "md:grid md:grid-cols-2" : "md:grid md:grid-cols-3"} md:overflow-visible gap-6 md:gap-8 items-stretch md:items-start ${className}`}
      staggerChildren={0.1}
    >
      {packages.map((pkg) => {
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
                {pkg.priceFrom && (
                  <span className={`mr-2 align-middle text-xl ${pkg.featured ? "text-white/80" : "text-re-stone"}`}>
                    From
                  </span>
                )}
                {pkg.price}
              </p>
              <p className={`mt-3 text-sm ${pkg.featured ? "text-white/85" : "text-re-stone"}`}>
                {pkg.products} · {pkg.turnaround}
              </p>

              {pkg.scope && (
                <p
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    pkg.featured ? "bg-white/10 text-white" : "bg-re-blue-light text-re-ink"
                  }`}
                >
                  {pkg.scope}
                </p>
              )}

              <p
                className={`mt-6 pt-5 border-t font-serif text-lg leading-snug ${
                  pkg.featured ? "border-white/20 text-white" : "border-re-stone-light text-re-ink"
                }`}
              >
                {pkg.note}
              </p>

              <p
                className={`mt-5 text-sm leading-relaxed ${
                  pkg.featured ? "text-white" : "text-re-stone"
                }`}
              >
                {pkg.step}
              </p>

              <ul className={`mt-6 pt-6 border-t space-y-3 text-sm ${
                pkg.featured ? "border-white/20 text-white/90" : "border-re-stone-light text-re-ink"
              }`}>
                {pkg.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden
                      className={`mt-2 h-1 w-3 shrink-0 rounded-full ${
                        pkg.featured ? "bg-white/60" : "bg-re-blue-accent"
                      }`}
                    />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex-grow flex items-end">
                <CTAButton
                  href={`/book?p=${pkg.id}`}
                  variant={pkg.featured ? "outline-light" : "solid"}
                >
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
