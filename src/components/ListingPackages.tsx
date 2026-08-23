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
      className={`flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2 md:pb-0 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible gap-6 md:gap-8 items-stretch md:items-start ${className}`}
      staggerChildren={0.1}
    >
      {LISTING_PACKAGES.map((pkg) => (
        <StaggerChild
          key={pkg.name}
          className={`gold-ring snap-center shrink-0 w-[86%] sm:w-[64%] md:w-auto relative flex flex-col p-8 md:p-9 rounded-[1.75rem] border transition-all duration-500 hover:-translate-y-1.5 ${
            pkg.featured
              ? "bg-re-blue text-white border-re-blue hover:shadow-[0_30px_70px_rgba(28,58,94,0.32)]"
              : "bg-re-ivory border-re-stone-light hover:shadow-[0_30px_70px_rgba(28,58,94,0.12)]"
          }`}
        >
          {pkg.featured && (
            <span className="gold-chrome-bg absolute -top-3.5 left-8 rounded-full text-re-ink text-[10px] tracking-[0.22em] uppercase px-4 py-1.5 shadow-[0_4px_14px_rgba(196,169,108,0.4)]">
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
