import type { Metadata } from "next";
import Image from "next/image";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "SCRM Media Real Estate is the property side of SCRM Media, an Australian content and marketing studio.",
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
            alt="Listing media"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-re-ink/30 via-re-ink/55 to-re-ink/85" />
        </div>
        <Container className="relative w-full pb-16 md:pb-24">
          <Reveal>
            <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
            <h1 className=" h-display text-5xl md:text-6xl text-white max-w-3xl">
              Built for real estate.
            </h1>
          </Reveal>
        </Container>
      </div>
      </section>

      {/* WHO WE ARE */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <Reveal direction="left" className="md:col-span-5">
              <H2 rule>Who we are</H2>
            </Reveal>
            <Reveal direction="right" className="md:col-span-7 space-y-5 text-lg text-re-stone leading-relaxed" delay={0.1}>
              <p>
                SCRM Media Real Estate is the property side of SCRM Media, an Australian content and marketing studio.
              </p>
              <p>
                We produce listing media, agent video and social content for agencies and agents. Everything is produced in house. Planning, filming, editing and delivery are handled by the same people, so the work stays consistent.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* WHAT WE DO */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <H2 rule>What we do</H2>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6" staggerChildren={0.1}>
            {[
              {
                t: "Listing media",
                d: "Photography, floor plans and video in every package. Shot on professional camera and branded to your agency.",
              },
              {
                t: "Agent video",
                d: "Vertical video that puts the agent on camera, plus the social assets that go with a campaign. Branded to the agent, not just the agency.",
              },
              {
                t: "Social management",
                d: "Content planned monthly, filmed on site, scheduled and posted. You turn up for the shoot and we handle the rest.",
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
                  alt="Filming on site"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
            <Reveal direction="right" className="md:col-span-6" delay={0.1}>
              <H2 rule>One team, start to finish.</H2>
              <p className="mt-5 text-re-stone leading-relaxed">
                Planning, filming, editing, scheduling and listing media all handled in house. Nothing gets handed down a chain, which is why the look stays consistent across everything we make for you.
              </p>
              <ul className="mt-6 space-y-3 text-re-ink">
                {[
                  "Direct contact with the people doing the work",
                  "Content batched on site, not shot piecemeal",
                  "Listing media planned around your campaign dates",
                  "Everything branded to you, ready to post",
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

      {/* CLOSE */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <H2 light>
                Let&apos;s talk about your listings.
              </H2>
              <p className="mt-5 text-white/85 text-lg max-w-2xl">
                Tell us what you&apos;re running and we&apos;ll show you what it would look like.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="/services" variant="white">See packages</CTAButton>
                <CTAButton href="/contact" variant="outline-light">
                  Get in touch
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
