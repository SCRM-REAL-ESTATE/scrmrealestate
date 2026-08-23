import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "SCRM Media Real Estate is a specialist content and marketing studio for premium agencies, agents, and developers across Australia.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="relative min-h-[55vh] flex items-end overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <div className="absolute inset-0">
          <Image
            src="/media/listings/listing-04.png"
            alt="Editorial real estate brand"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-re-ink/30 via-re-ink/55 to-re-ink/85" />
        </div>
        <Container className="relative w-full pb-16 md:pb-24">
          <Reveal>
            <Eyebrow>
              <span className="!text-white/85">About</span>
            </Eyebrow>
            <h1 className="mt-3 h-display text-5xl md:text-6xl text-white max-w-3xl">
              A specialist content studio for premium real estate.
            </h1>
          </Reveal>
        </Container>
      </div>
      </section>

      {/* INTRO */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <Reveal direction="left" className="md:col-span-5">
              <Eyebrow>Who we are</Eyebrow>
              <H2 className="mt-3">Built only for real estate.</H2>
            </Reveal>
            <Reveal direction="right" className="md:col-span-7 space-y-5 text-lg text-re-stone leading-relaxed" delay={0.1}>
              <p>
                SCRM Media Real Estate is the real estate division of SCRM Media — an Australian content and marketing studio working specifically with real estate agencies, top-performing agents, and boutique developers.
              </p>
              <p>
                We are not a generalist agency that "also does real estate." Every system, every workflow, and every piece of creative we produce is built around how property actually sells: trust before the call, presentation before the listing, and consistency before the campaign.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* PRINCIPLES */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>What we believe</Eyebrow>
              <H2 className="mt-3">Three principles guide every account we run.</H2>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6" staggerChildren={0.1}>
            {[
              {
                t: "Systems beat sprints",
                d: "One brilliant video can't carry a brand. A consistent monthly system, properly planned and produced, will outperform random posting every time.",
              },
              {
                t: "Trust is earned visually",
                d: "Sellers, buyers, landlords and investors decide who to call long before they call. Listing photography, agent presence, and editorial restraint do that quiet, important work.",
              },
              {
                t: "Specialists, not generalists",
                d: "Real estate has its own pace, language, compliance, and audience. A studio focused only on real estate compounds that knowledge into every asset we produce.",
              },
            ].map((p, i) => (
              <StaggerChild key={p.t} className="rounded-[1.75rem] border border-re-stone-light bg-re-ivory p-8 md:p-10 transition-all duration-500 hover:bg-white hover:shadow-[0_24px_60px_rgba(30,98,224,0.1)]">
                <p className="font-serif gold-text text-2xl">0{i + 1}</p>
                <h3 className="mt-6 font-serif text-2xl text-re-ink">{p.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{p.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* HOW WE WORK */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            <Reveal direction="left" className="md:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-re-stone-light group">
                <Image
                  src="/media/listings/listing-08.png"
                  alt="SCRM Media production"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
            <Reveal direction="right" className="md:col-span-6" delay={0.1}>
              <Eyebrow>How we work</Eyebrow>
              <H2 className="mt-3">A small senior team. End-to-end production.</H2>
              <p className="mt-5 text-re-stone leading-relaxed">
                Strategy, planning, filming, editing, scheduling, and listing media — handled by a tight, senior team rather than handed off through a chain of juniors. That's how we keep voice consistent and turnaround fast.
              </p>
              <ul className="mt-6 space-y-3 text-re-ink">
                {[
                  "Direct relationships with agents and principals",
                  "Monthly content batched on-site",
                  "Listing media planned around release schedule",
                  "Editorial-grade output, not template content",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1 w-3 rounded-full bg-re-blue-accent shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow light>Work with us</Eyebrow>
              <H2 light className="mt-3">
                The right partner if your brand should look better than it currently does.
              </H2>
              <p className="mt-5 text-white/85 text-lg max-w-2xl">
                We don't onboard everyone — we work best with agencies that take their reputation seriously and want a real partner. Tell us about your goals.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="/contact" variant="white">Book a strategy call</CTAButton>
                <CTAButton href="/work" variant="outline-light">
                  See our work
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
