import type { Metadata } from "next";
import Link from "next/link";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import FAQAccordion from "@/components/FAQAccordion";
import ListingPackages from "@/components/ListingPackages";
import {
  COMMERCIAL_ADD_ONS,
  COMMERCIAL_FROM,
  COMMERCIAL_PACKAGES,
  COMMERCIAL_PROJECT,
  LISTING_PACKAGES,
} from "@/lib/pricing";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Commercial",
  description:
    "Photography, film, aerial and agent-led video for commercial property campaigns. Office, industrial, retail, development sites and land, scheduled to your EOI or auction close and quoted per asset.",
  alternates: { canonical: "/commercial" },
};

const ENTRY_PRICE = LISTING_PACKAGES[0].price;

/* Deliberately no photography on this page yet. Every frame in the library is
   residential, and a warehouse campaign sold with apartment interiors argues
   against itself. */

const ASSET_CLASSES = [
  { t: "Office", d: "Whole floors, suites and strata. Shot so a floorplate reads." },
  { t: "Industrial", d: "Warehouse, hardstand and clearance, with something in frame for scale." },
  { t: "Retail", d: "Strip, centre and large format, shot around a trading tenant." },
  { t: "Development sites", d: "Aerial context, frontage, and what sits around the boundary." },
  { t: "Land and subdivision", d: "Parcels shot from height so shape and access are obvious." },
  { t: "Mixed use", d: "Assets that sell on two stories at once, shot for both." },
];

const faqs = [
  {
    q: "What if the asset is bigger than the packages?",
    a: "Then it is a bespoke project and we quote it. The two packages buy one office suite, floor or warehouse of standard size, shot in a single visit. Past that, and for government, institutional and development work, the brief sets what gets captured and we price on the expertise it calls for rather than on a count of products.",
  },
  {
    q: "How far ahead should we book?",
    a: "Tell us the close date and we work backwards from it. The earlier we see the campaign schedule, the more of it we can capture in a single visit rather than returning for pieces.",
  },
  {
    q: "Can you shoot around tenants who are still trading?",
    a: "Yes. We schedule to trading hours and access rather than to our own convenience, and we plan the run of shots so we're in and out of any one area quickly.",
  },
  {
    q: "Are you insured, and will you sign our NDA?",
    a: "Yes to both. We carry public liability cover and send the certificate of currency with the quote. On confidentiality we sign your agreement before we shoot: off-market campaigns stay off-market, and nothing goes out as a sample or a teaser without your approval.",
  },
  {
    q: "Do you do residential as well?",
    a: `Yes, and it's priced completely differently: per property, from ${ENTRY_PRICE}, with photos, a floor plan and video delivered next business day. Commercial is quoted per asset because the campaigns aren't comparable.`,
  },
];

export default function CommercialPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          <Container className="relative py-16 md:py-28">
            <div className="max-w-3xl">
              <Reveal direction="up">
                <h1 className="h-display text-4xl sm:text-5xl md:text-7xl text-white">
                  Commercial property, shot for the campaign.
                </h1>
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/85 leading-relaxed">
                  Office, industrial, retail, development sites and land. Photography, film, aerial
                  and agent-led video, scheduled against your EOI or auction close and quoted per
                  asset.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <CTAButton href="/book?p=pkg-commercial-project" variant="white">
                    Request a quote
                  </CTAButton>
                  <CTAButton href="#campaign" variant="outline-light">
                    How a campaign runs
                  </CTAButton>
                </div>
                <ul className="mt-10 grid grid-cols-1 sm:flex sm:flex-wrap gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {[
                    "From " + COMMERCIAL_FROM + " an asset",
                    "Public liability insured",
                    "NDAs signed",
                    "Melbourne and Sydney metro",
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <span aria-hidden className="text-re-gold-thin">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      {/* ASSET CLASSES */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <H2 rule>What we shoot.</H2>
              <p className="mt-5 text-lg text-re-stone leading-relaxed">
                Most of it is office space and warehousing.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerChildren={0.07}>
            {ASSET_CLASSES.map((a) => (
              <StaggerChild
                key={a.t}
                className="rounded-[1.5rem] border border-re-stone-light bg-white p-7"
              >
                <h3 className="font-serif text-xl text-re-ink">{a.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{a.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* HOW IT'S SHOT */}
      <Section>
        <Container>
          <Reveal>
            <H2 rule className="max-w-3xl">Scale is the whole problem.</H2>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" staggerChildren={0.09}>
            {[
              {
                t: "A wide shot of a shed says nothing",
                d: "Clear height, column spacing and hardstand only read when there's something in frame to measure them against. That's a decision made on the day, not in the edit.",
              },
              {
                t: "Floorplates have to be followable",
                d: "A buyer holding the plan should be able to place every shot on it. We shoot the sequence in the order someone walks it.",
              },
              {
                t: "Aerial is for context, not spectacle",
                d: "Where the site sits, how trucks get in, what the boundary backs onto, what's going up next door. The orbit is the least useful thing a drone does here.",
              },
              {
                t: "The asset is usually still working",
                d: "Tenants trading, staff on site, trucks moving. We plan the run so we're through any one area fast and the business keeps operating around us.",
              },
            ].map((b) => (
              <StaggerChild
                key={b.t}
                className="rounded-[1.75rem] border border-re-stone-light bg-white p-8 md:p-9"
              >
                <h3 className="font-serif text-2xl text-re-ink">{b.t}</h3>
                <p className="mt-4 text-re-stone leading-relaxed">{b.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* AGENT VIDEO, FOR COMMERCIAL */}
      <Section panel="blue">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <H2 rule light>Your buyers are on LinkedIn.</H2>
              <p className="mt-6 text-lg text-white/85 leading-relaxed">
                Commercial is an authority business. Nobody picks an agent off a hero shot of a
                warehouse, they pick the one whose read on the market they already know.
              </p>
              <p className="mt-5 text-lg text-white/85 leading-relaxed">
                Same agent-led video, cut for where commercial actually happens. Captioned for a
                feed people scroll at work with the sound off.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="space-y-4">
                {[
                  "Market commentary while the numbers are still moving",
                  "Yield and rate movement, in your own words",
                  "Leasing availability across your book",
                  "What a precinct is doing and why it matters",
                  "A walkthrough of an asset you're taking to market",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-4 rounded-2xl border border-white/20 bg-white/5 px-6 py-4"
                  >
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-white/50" />
                    <span className="leading-relaxed text-white/90">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* HOW A CAMPAIGN RUNS */}
      <Section id="campaign">
        <Container>
          <Reveal>
            <H2 rule className="max-w-3xl">How a campaign runs.</H2>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14" staggerChildren={0.12}>
            {[
              {
                n: "01",
                t: "Brief and schedule",
                d: "You send the asset and the close date. We work backwards from it and lock shoot dates around access, tenant hours and the light the building actually gets.",
              },
              {
                n: "02",
                t: "One visit where we can",
                d: "Stills, film and aerial together, plus your pieces to camera while we're on site. Returning for fragments costs you campaign days you don't have.",
              },
              {
                n: "03",
                t: "Delivered to the calendar",
                d: "Sized for the information memorandum, the portals, the boards and LinkedIn. Branded and unbranded, so the same shoot carries the whole campaign.",
              },
            ].map((s) => (
              <StaggerChild key={s.n} className="border-t border-re-blue/15 pt-6">
                <p className="font-serif text-3xl gold-text">{s.n}</p>
                <h3 className="mt-3 font-serif text-2xl text-re-ink">{s.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{s.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* THE SOFTWARE */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <H2 rule>Our own production platform.</H2>
              <p className="mt-5 text-lg text-re-stone leading-relaxed">
                A commercial campaign is judged on how the asset is presented. So the
                finishing is not sent out to whoever is available that week. Every frame
                is built on software we run ourselves, which means the standard is set
                inside the process rather than left to someone else's queue.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerChildren={0.07}>
            {[
              {
                t: "Photo staging",
                d: "Vacant suites and floors furnished to the standard of the building, so a buyer reads the space as it will be occupied rather than as an empty shell.",
              },
              {
                t: "Video staging",
                d: "The same furnished treatment carried through the walkthrough frame by frame, so the film and the stills present one asset rather than two.",
              },
              {
                t: "Twilight and dawn",
                d: "Daytime capture taken to twilight or dawn, the hours a building looks its best, held to the same grade across every frame of the campaign.",
              },
              {
                t: "Floor plans",
                d: "Drawn from the same capture and set in your agency's branding, so the plan in the memorandum sits beside the imagery as one piece of work.",
              },
              {
                t: "Your own dashboard",
                d: "Every asset gets its own. The finished campaign held in one place, sized for the memorandum, the portals, the boards and LinkedIn.",
              },
            ].map((f) => (
              <StaggerChild
                key={f.t}
                className="rounded-[1.5rem] border border-re-stone-light bg-re-ivory p-7"
              >
                <h3 className="font-serif text-xl text-re-ink">{f.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{f.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* PRICING */}
      <Section panel="tint" id="pricing">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <H2 rule>What it costs.</H2>
              <p className="mt-5 text-lg text-re-stone leading-relaxed">
                Two fixed packages for an office suite, floor or warehouse of standard
                size. That covers most of what we shoot. Anything larger is quoted.
              </p>
            </div>
          </Reveal>

          <div className="mt-12">
            <ListingPackages packages={COMMERCIAL_PACKAGES} />
          </div>

          {/* The third tier, given the width the other two share so it reads as
              a step up rather than a footnote under them. */}
          <Reveal delay={0.14}>
            <div className="gold-ring mt-8 rounded-[1.75rem] border border-re-blue/20 bg-white p-8 md:p-12 text-center">
              <p className="label-eyebrow">{COMMERCIAL_PROJECT.name}</p>
              <p className="mt-3 font-serif text-4xl md:text-5xl text-re-ink">
                {COMMERCIAL_PROJECT.price}
              </p>

              <p className="mx-auto mt-6 max-w-xl border-t border-re-stone-light pt-6 font-serif text-lg leading-snug text-re-ink">
                {COMMERCIAL_PROJECT.note}
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-re-stone leading-relaxed">
                {COMMERCIAL_PROJECT.pitch}
              </p>

              <ul className="mx-auto mt-9 grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-left text-sm text-re-ink">
                {COMMERCIAL_PROJECT.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-re-blue-accent" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex justify-center">
                <CTAButton href={`/book?p=${COMMERCIAL_PROJECT.id}`}>Request a quote</CTAButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 rounded-[1.75rem] border border-re-stone-light bg-white p-8 md:p-10">
              <p className="label-eyebrow">Add to any campaign</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3 text-sm text-re-ink">
                {COMMERCIAL_ADD_ONS.map((a) => (
                  <li key={a.id} className="flex justify-between gap-4 border-b border-re-stone-light pb-3">
                    <span>
                      {a.name}
                      {a.detail && <span className="block text-xs text-re-stone">{a.detail}</span>}
                    </span>
                    <span className="shrink-0 font-medium text-re-blue">{a.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 text-sm text-re-stone">
              Residential prices separately, per property.{" "}
              <Link
                href="/services"
                className="text-re-blue underline decoration-re-blue-accent/40 underline-offset-4 transition-colors hover:text-re-blue-accent"
              >
                Listing packages from {ENTRY_PRICE}
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <Reveal>
            <H2 rule className="max-w-2xl">Before you send it to us.</H2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <FAQAccordion items={faqs} light={false} />
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <H2 rule light className="[&>span]:mx-auto">
                Send us the asset and the close date.
              </H2>
              <p className="mt-6 text-lg text-white/85">
                That&apos;s enough to quote it. If the campaign is already live and you need dates
                fast, call {SITE.phone}.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href="/book?p=pkg-commercial-project" variant="white">
                  Request a quote
                </CTAButton>
                <CTAButton href={`tel:${SITE.phoneIntl}`} variant="outline-light" external>
                  {SITE.phone}
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
