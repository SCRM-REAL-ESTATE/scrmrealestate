import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";
import AddOnsDialog from "@/components/AddOnsDialog";
import ListingPackages from "@/components/ListingPackages";
import AgentContentCard from "@/components/AgentContentCard";
import { ADD_ONS_FROM } from "@/lib/pricing";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[var(--shell-h)] pt-[var(--shell-h)] min-h-[100svh] flex items-end overflow-hidden">
        <HeroVideo />
        <Container className="relative w-full pb-16 md:pb-24">
          <Reveal direction="up">
            <div className="max-w-3xl">
              <span className="label-eyebrow !text-white/85">SCRM Media · Real Estate</span>
              <h1 className="mt-4 h-display text-5xl md:text-7xl text-white">
                Premium content systems
                <br />
                for luxury real estate.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
                We help boutique agencies, top-performing agents, and developers build a consistent, editorial brand presence that earns trust before the first call.
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
      </section>

      {/* MARQUEE STRIP */}
      <div className="bg-re-blue text-white/60 overflow-hidden border-y border-white/10">
        <div className="flex animate-[marquee_38s_linear_infinite] py-4 whitespace-nowrap label-eyebrow !text-white/55">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-5 shrink-0">
              <span>Boutique Agencies</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Top-Performing Agents</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Property Developers</span>
              <span className="text-re-gold-thin">◆</span>
              <span>Luxury Listings</span>
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
              <H2 className="mt-3">Three pillars. One coherent brand.</H2>
              <p className="mt-5 text-re-stone text-lg leading-relaxed">
                Most agencies post. The strongest agencies build a system. Ours is built around three pillars that work together — not independently.
              </p>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-re-stone-light border border-re-stone-light rounded-[1.75rem] overflow-hidden">
            {[
              {
                t: "Social Media",
                d: "8 videos, 6 posts, 6 stories per month. Strategy, planning, scripting, filming, editing, scheduling — all coordinated.",
                i: "01",
              },
              {
                t: "Listing Photography",
                d: "Photos, a branded floor plan and listing video in one package — from $349, delivered next business day.",
                i: "02",
              },
              {
                t: "Vertical Content",
                d: "Reels, TikTok, and short-form video that turns a single listing into a week of distribution.",
                i: "03",
              },
            ].map((p) => (
              <StaggerChild key={p.t} className="bg-re-ivory p-8 md:p-10 group transition-colors hover:bg-white">
                <span className="font-serif text-re-blue-accent text-2xl">{p.i}</span>
                <h3 className="mt-6 font-serif text-2xl md:text-3xl text-re-ink">{p.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{p.d}</p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-re-blue group-hover:text-re-blue-accent transition-colors"
                >
                  Learn more
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* LISTING PACKAGES */}
      <Section className="bg-white border-y border-re-stone-light">
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
              <Link href="/services#social" className="text-re-blue hover:text-re-blue-accent underline decoration-re-blue-accent/40 underline-offset-4 transition-colors">
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

          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" staggerChildren={0.05}>
            {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <StaggerChild key={n} className="relative aspect-[4/5] overflow-hidden bg-re-stone-light group">
                <Image
                  src={`/media/listings/listing-${String(n).padStart(2, "0")}.png`}
                  alt={`Listing ${n}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-re-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* PROCESS */}
      <Section className="bg-re-ivory border-y border-re-stone-light">
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
              <StaggerChild key={s.n} className="border-t border-re-stone-light/80 pt-6">
                <p className="font-serif text-3xl text-re-blue-accent">{s.n}</p>
                <h3 className="mt-3 font-serif text-2xl text-re-ink">{s.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{s.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <Container>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-10" staggerChildren={0.15}>
            {[
              {
                q: "Our enquiry quality changed almost immediately. Sellers come in already understanding our process.",
                a: "Principal, Boutique Agency",
              },
              {
                q: "It finally feels like we have a brand, not just a feed. The team look the part on camera and we're winning listings on it.",
                a: "Director, Sales & Property Management",
              },
            ].map((t) => (
              <StaggerChild key={t.a}>
                <figure className="gold-ring rounded-[1.75rem] border border-re-stone-light p-8 md:p-10 bg-white h-full transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(28,58,94,0.12)]">
                  <span className="font-serif text-5xl text-re-blue-accent leading-none">“</span>
                  <blockquote className="mt-2 font-serif text-2xl md:text-[28px] text-re-ink leading-snug">
                    {t.q}
                  </blockquote>
                  <figcaption className="mt-6 label-eyebrow">{t.a}</figcaption>
                </figure>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section dark className="!py-24">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow light>Ready to look like the agency you actually are?</Eyebrow>
              <H2 light className="mt-3">
                Let's build a content system worth trusting.
              </H2>
              <p className="mt-5 text-white/75 text-lg max-w-2xl">
                A 30-minute call is enough to map what your content should look like over the next 90 days. No pressure, no template pitch.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="/contact">Book a call</CTAButton>
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
