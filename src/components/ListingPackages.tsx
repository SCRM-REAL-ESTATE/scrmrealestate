import { CTAButton } from "./ui";
import { Stagger, StaggerChild } from "./Reveal";
import { LISTING_PACKAGES } from "@/lib/pricing";

/**
 * The three listing packages as individual cards. Shared by the home page and
 * Services so the two can never show different inclusions.
 */
export default function ListingPackages({ className = "" }: { className?: string }) {
  return (
    <Stagger
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start ${className}`}
      staggerChildren={0.1}
    >
      {LISTING_PACKAGES.map((pkg) => (
        <StaggerChild
          key={pkg.name}
          className={`relative flex flex-col p-8 md:p-9 border transition-all duration-500 ${
            pkg.featured
              ? "bg-re-blue text-white border-re-blue hover:shadow-[0_24px_60px_rgba(28,58,94,0.25)]"
              : "bg-re-ivory border-re-stone-light hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(28,58,94,0.08)] hover:border-re-blue/40"
          }`}
        >
          {pkg.featured && (
            <span className="absolute -top-3 left-8 bg-re-gold-thin text-re-ink text-[10px] tracking-[0.22em] uppercase px-3 py-1">
              Most Popular
            </span>
          )}

          <p className={`label-eyebrow ${pkg.featured ? "!text-white/70" : ""}`}>{pkg.name}</p>
          <p className={`mt-3 font-serif text-5xl ${pkg.featured ? "text-white" : "text-re-ink"}`}>
            {pkg.price}
          </p>
          <p className={`mt-3 text-sm ${pkg.featured ? "text-white/70" : "text-re-stone"}`}>
            {pkg.products} · {pkg.turnaround}
          </p>

          <ul className={`mt-7 space-y-3 text-sm flex-grow ${pkg.featured ? "text-white/90" : "text-re-ink"}`}>
            {pkg.includes.map((line) => (
              <li key={line} className="flex gap-3">
                <span className={`mt-2 h-1 w-3 shrink-0 ${pkg.featured ? "bg-white/60" : "bg-re-blue-accent"}`} />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>

          <p
            className={`mt-7 pt-6 border-t font-serif text-lg leading-snug ${
              pkg.featured ? "border-white/20 text-white" : "border-re-stone-light text-re-ink"
            }`}
          >
            {pkg.note}
          </p>

          <div className="mt-7">
            <CTAButton href="/contact" variant={pkg.featured ? "outline-light" : "solid"}>
              Book this package
            </CTAButton>
          </div>
        </StaggerChild>
      ))}
    </Stagger>
  );
}
