import { CTAButton } from "./ui";
import TiltCard from "./TiltCard";
import { AGENT_CONTENT } from "@/lib/pricing";

/**
 * Agent monthly content, sold to the individual agent rather than the agency.
 * Sits on its own below the listing packages — it isn't a listing product and
 * shouldn't be compared against one.
 */
export default function AgentContentCard({ dark = false }: { dark?: boolean }) {
  return (
    <TiltCard
      className={`gold-ring max-w-2xl mx-auto text-center border rounded-[2rem] p-7 md:p-10 transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(28,58,94,0.12)] ${
        dark ? "bg-re-blue border-white/20 text-white" : "bg-white border-re-stone-light"
      }`}
    >
      <p className={`label-eyebrow ${dark ? "!text-white/85" : ""}`}>{AGENT_CONTENT.name}</p>

      <p className={`mt-3 font-serif text-4xl md:text-5xl ${dark ? "text-white" : "text-re-ink"}`}>
        {AGENT_CONTENT.price}
        <span className={`ml-2 text-sm font-sans ${dark ? "text-white/85" : "text-re-stone"}`}>
          {AGENT_CONTENT.priceSub}
        </span>
      </p>

      <h3 className={`mt-5 font-serif text-xl md:text-2xl ${dark ? "text-white" : "text-re-ink"}`}>
        {AGENT_CONTENT.headline}
      </h3>

      <p className={`mt-4 leading-relaxed ${dark ? "text-white/85" : "text-re-stone"}`}>
        {AGENT_CONTENT.pitch}
      </p>

      <ul
        className={`mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-left ${
          dark ? "text-white/90" : "text-re-ink"
        }`}
      >
        {AGENT_CONTENT.includes.map((line) => (
          <li key={line} className="flex gap-3">
            <span className={`mt-2 h-1 w-3 shrink-0 rounded-full ${dark ? "bg-white/60" : "bg-re-blue-accent"}`} />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>

      <p
        className={`mt-7 border-t pt-6 font-serif text-lg leading-snug ${
          dark ? "border-white/20 text-white" : "border-re-stone-light text-re-ink"
        }`}
      >
        {AGENT_CONTENT.vsListing}
      </p>

      <div className="mt-7 flex justify-center">
        <CTAButton href="/contact" variant={dark ? "outline-light" : "solid"}>
          Book a filming day
        </CTAButton>
      </div>
    </TiltCard>
  );
}
