import { CTAButton } from "./ui";
import { AGENT_CONTENT } from "@/lib/pricing";

/**
 * Agent monthly content, sold to the individual agent rather than the agency.
 * Sits on its own below the listing packages — it isn't a listing product and
 * shouldn't be compared against one.
 */
export default function AgentContentCard({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`max-w-3xl mx-auto text-center border p-9 md:p-12 ${
        dark ? "bg-re-blue border-white/20 text-white" : "bg-white border-re-stone-light"
      }`}
    >
      <p className={`label-eyebrow ${dark ? "!text-white/70" : ""}`}>{AGENT_CONTENT.name}</p>

      <p className={`mt-4 font-serif text-5xl md:text-6xl ${dark ? "text-white" : "text-re-ink"}`}>
        {AGENT_CONTENT.price}
        <span className={`ml-2 text-base font-sans ${dark ? "text-white/70" : "text-re-stone"}`}>
          {AGENT_CONTENT.priceSub}
        </span>
      </p>

      <h3 className={`mt-6 font-serif text-2xl md:text-3xl ${dark ? "text-white" : "text-re-ink"}`}>
        {AGENT_CONTENT.headline}
      </h3>

      <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/75" : "text-re-stone"}`}>
        {AGENT_CONTENT.pitch}
      </p>

      <ul
        className={`mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-left ${
          dark ? "text-white/90" : "text-re-ink"
        }`}
      >
        {AGENT_CONTENT.includes.map((line) => (
          <li key={line} className="flex gap-3">
            <span className={`mt-2 h-1 w-3 shrink-0 ${dark ? "bg-white/60" : "bg-re-blue-accent"}`} />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-9 flex justify-center">
        <CTAButton href="/contact" variant={dark ? "outline-light" : "solid"}>
          Book a filming day
        </CTAButton>
      </div>
    </div>
  );
}
