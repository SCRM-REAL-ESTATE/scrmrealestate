import Link from "next/link";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";
import AddOnsDialog from "@/components/AddOnsDialog";
import ListingPackages from "@/components/ListingPackages";
import AgentContentCard from "@/components/AgentContentCard";
import HomeWorkPreview from "@/components/HomeWorkPreview";
import { ADD_ONS_FROM } from "@/lib/pricing";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="relative min-h-[86svh] flex items-end overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <HeroVideo />
        <Container className="relative w-full pb-16 md:pb-24">
          <Reveal direction="up">
            <div className="max-w-3xl">
              <span className="label-eyebrow !text-white/85">SCRM Media · Real Estate</span>
              <h1 className="mt-4 h-display text-5xl md:text-7xl text-white">
                Premium content systems
                <br />
                for real estate.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
                Listing media, agent videos and full social management — filmed, edited and delivered for you.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="/contact">Book a strategy call</CTAButton>
                <CTAButton href="/work" variant="outline-light">
                  See our work
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center text-white/65 text-[10px] tracking-[0.3em] uppercase">
          <span>Scroll</span>
          <span className="mt-2 block h-10 w-px bg-white/40 overflow-hidden relative">
            <span className="absolute top-0 left-0 right-0 h-4 bg-white animate-[scrollHint_1.8s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        </div>
      </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="blue-fade text-white overflow-hidden border-y border-white/10">
        <div className="flex animate-[marquee_38s_linear_infinite] py-4 whitespace-nowrap label-eyebrow !text-white">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5 shrink-0">
              <span>Boutique Agencies</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Top-Performing Agents</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Property Developers</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Premium Listings</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Editorial Content</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Australia-Wide</span>
              <span className="text-re-gold-thin">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* THREE PILLARS */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>What we do</Eyebrow>
              <H2 className="mt-3">Three ways to work with us.</H2>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                t: "Listing packages",
                price: "$349",
                priceSub: "from, per listing",
                d: "Photos, floor plan and video. Shot one day, delivered the next.",
                i: "01",
                href: "/services",
                cta: "See the packages",
              },
              {
                t: "Agent content",
                price: "$800",
                priceSub: "per month",
                d: "Four videos a month that sell you, not the house. One hour of your time.",
                i: "02",
                href: "/services#agent",
                cta: "How it works",
              },
              {
                t: "Agency management",
                price: "$1,800",
                priceSub: "from, per month",
                d: "Your whole social presence run for you — 8 videos, 6 posts, 6 stories a month.",
                i: "03",
                href: "/agencies",
                cta: "For agencies",
              },
            ].map((p) => (
              <StaggerChild key={p.t}>
                <Link
                  href={p.href}
                  className="group flex flex-col h-full rounded-[1.75rem] border border-re-stone-light bg-white p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-re-blue-accent/40 hover:shadow-[0_24px_60px_rgba(30,98,224,0.12)]"
                >
                  <span className="font-serif gold-text text-2xl">{p.i}</span>
                  <h3 className="mt-5 font-serif text-2xl md:text-3xl text-re-ink">{p.t}</h3>
                  <p className="mt-4 font-serif text-4xl md:text-5xl text-re-blue">
                    {p.price}
                    <span className="ml-2 text-xs font-sans text-re-stone tracking-wide uppercase">{p.priceSub}</span>
                  </p>
                  <p className="mt-4 text-re-stone leading-relaxed flex-grow">{p.d}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-re-blue group-hover:text-re-blue-accent transition-colors">
                    {p.cta}
                    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* LISTING PACKAGES */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <Eyebrow>Listing packages</Eyebrow>
                <H2 className="mt-3">Every listing, a complete campaign.</H2>
                <p className="mt-5 text-re-stone leading-relaxed">
                  Photos, a branded floor plan and video — delivered next business day.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <AddOnsDialog label={`Add-ons from ${ADD_ONS_FROM}`} variant="outline" />
                <Link href="/services" className="group inline-flex items-center gap-2 text-sm text-re-blue hover:text-re-blue-accent transition-colors">
                  See services &amp; pricing
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <ListingPackages />
        </Container>
      </Section>

      {/* AGENT CONTENT */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="h-display text-5xl md:text-7xl text-re-ink">
                What every agent is missing.
              </h2>
              <p className="mt-6 font-serif text-2xl md:text-3xl text-re-ink/85">
                Your listings market the house. Not you.
              </p>
              <p className="mt-5 max-w-2xl mx-auto text-re-stone leading-relaxed text-lg">
                Vendors don&apos;t choose a house. They choose a person — and they decide before
                they call. Four videos a month is how you win that.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-12">
            <AgentContentCard />
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-sm text-re-stone">
              Running an agency instead?{" "}
              <Link href="/agencies" className="text-re-blue hover:text-re-blue-accent underline decoration-re-blue-accent/40 underline-offset-4 transition-colors">
                Monthly social media management from $1,800
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* WORK GALLERY PREVIEW */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <Eyebrow>Recent work</Eyebrow>
                <H2 className="mt-3">A look at what we produce.</H2>
              </div>
              <Link href="/work" className="group inline-flex items-center gap-2 text-sm text-re-blue hover:text-re-blue-accent transition-colors">
                See full gallery
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>

          <HomeWorkPreview />
        </Container>
      </Section>

      {/* PROCESS */}
      <Section panel="tint">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Process</Eyebrow>
              <H2 className="mt-3">How we partner with you.</H2>
            </div>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14" staggerChildren={0.12}>
            {[
              {
                n: "01",
                t: "Strategy & direction",
                d: "We map content pillars to your business goals — what you sell, who you serve, and what makes you different locally.",
              },
              {
                n: "02",
                t: "Production system",
                d: "Monthly filming, editing, listing media, and scheduling — built to run consistently, month after month.",
              },
              {
                n: "03",
                t: "Refine & scale",
                d: "We measure what's working, double down, and add channels — paid social, vertical, drone — when the time is right.",
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

      {/* FINAL CTA */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <Eyebrow light>Ready to look like the agency you actually are?</Eyebrow>
              <H2 light className="mt-3">
                Let's build a content system worth trusting.
              </H2>
              <p className="mt-5 text-white/85 text-lg max-w-2xl mx-auto">
                A 30-minute call is enough to map what your content should look like over the next 90 days. No pressure, no template pitch.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href="/contact" variant="white">Book a call</CTAButton>
                <CTAButton href="/services" variant="outline-light">
                  See services & pricing
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
