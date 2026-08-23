import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import ServiceIncludes from "@/components/ServiceIncludes";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Agencies",
  description:
    "Monthly social media management for real estate agencies — 8 videos, 6 posts and 6 stories a month, planned, filmed, edited and scheduled for you. From $1,800 per month.",
};

export default function AgenciesPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="bg-re-blue text-white rounded-[2rem] md:rounded-[2.5rem]">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Eyebrow light>For agencies</Eyebrow>
            <h1 className="mt-3 h-display text-5xl md:text-7xl text-white max-w-4xl">
              Your agency&apos;s social media. Run for you.
            </h1>
            <p className="mt-6 text-white/80 max-w-2xl text-lg md:text-xl leading-relaxed">
              8 videos, 6 posts and 6 stories every month — planned, filmed, edited and
              scheduled by one team. From $1,800 a month.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <CTAButton href="/contact" variant="white">Book a strategy call</CTAButton>
              <CTAButton href="/work" variant="outline-light">
                See the work
              </CTAButton>
            </div>
          </Reveal>
        </Container>
      </div>
      </section>

      {/* WHAT IT IS */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <Reveal direction="left" className="md:col-span-5">
              <Eyebrow>What it is</Eyebrow>
              <H2 className="mt-3">A content system, not a freelancer with a camera.</H2>
            </Reveal>
            <Reveal direction="right" className="md:col-span-7 space-y-5 text-lg text-re-stone leading-relaxed" delay={0.1}>
              <p className="text-re-ink">
                Most agencies post when someone remembers to. We replace that with a monthly
                rhythm: we plan the month, film it in one batch at your office or on a listing,
                edit everything, write the captions, and schedule it. Your feed runs whether
                you&apos;re busy or not.
              </p>
              <p>
                One team owns the whole thing — strategy, filming, editing, posting — so the
                brand stays consistent and nothing falls between a photographer, an editor and
                whoever has the login this week.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* WHAT YOU GET */}
      <Section panel="white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            <Reveal direction="left" className="md:col-span-6">
              <Eyebrow>What you get</Eyebrow>
              <H2 className="mt-3">Every month, on schedule.</H2>
              <p className="mt-4 font-serif text-4xl text-re-blue">
                From $1,800
                <span className="ml-2 text-sm font-sans text-re-stone">per month</span>
              </p>
              <div className="mt-8">
                <ServiceIncludes
                  items={[
                    { label: "8 social media videos per month", examples: ["vertical", "testimonial"] },
                    { label: "6 social media posts per month", examples: ["carousel"] },
                    { label: "6 stories per month", examples: ["detail"] },
                    { label: "Monthly planning, direction & content coordination" },
                    { label: "Editing, captions & scheduling" },
                  ]}
                />
              </div>
              <p className="mt-8 text-re-stone leading-relaxed">
                Need more volume, paid social, or listing media rolled in? We scope that against
                your listing volume and quote it — no forced tiers.
              </p>
              <div className="mt-7">
                <CTAButton href="/contact">Enquire now</CTAButton>
              </div>
            </Reveal>
            <Reveal direction="right" className="md:col-span-6" delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-re-stone-light group">
                <Image
                  src="/media/listings/listing-05.png"
                  alt="Agency content production"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* WHY */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Why it matters</Eyebrow>
              <H2 className="mt-3">Sellers pick their agency before they call one.</H2>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6" staggerChildren={0.1}>
            {[
              {
                t: "Trust is built before the call",
                d: "Vendors look you up first. A feed that looks sharp and sounds local wins the appraisal before your competitors know it exists.",
              },
              {
                t: "Consistency beats bursts",
                d: "One good month of posting followed by silence reads as struggling. A system that never misses reads as an agency in demand.",
              },
              {
                t: "Your team stays selling",
                d: "Nobody at your office has to script, film, edit or remember to post. You show up to one filming batch a month — we do the rest.",
              },
            ].map((p) => (
              <StaggerChild key={p.t}>
                <TiltCard className="h-full rounded-[1.75rem] border border-re-stone-light bg-white p-8 md:p-10 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(30,98,224,0.12)]">
                  <h3 className="font-serif text-2xl text-re-ink">{p.t}</h3>
                  <p className="mt-3 text-re-stone leading-relaxed">{p.d}</p>
                </TiltCard>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* WHAT IT LOOKS LIKE */}
      <Section panel="tint">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>What it looks like</Eyebrow>
              <H2 className="mt-3">A month with us.</H2>
            </div>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10" staggerChildren={0.1}>
            {[
              {
                n: "01",
                t: "Plan",
                d: "We map the month — listings coming up, team moments, market talking points — and send you the plan.",
              },
              {
                n: "02",
                t: "Film",
                d: "One batch shoot at your office or on a listing. A half-day covers the whole month.",
              },
              {
                n: "03",
                t: "Edit",
                d: "We cut the videos, design the posts, write the captions — all in your branding.",
              },
              {
                n: "04",
                t: "Post",
                d: "Everything goes out on schedule. You watch the feed run and take the calls it brings in.",
              },
            ].map((s) => (
              <StaggerChild key={s.n} className="border-t border-re-blue/15 pt-6">
                <p className="font-serif text-3xl text-re-blue-accent">{s.n}</p>
                <h3 className="mt-3 font-serif text-2xl text-re-ink">{s.t}</h3>
                <p className="mt-3 text-re-stone leading-relaxed">{s.d}</p>
              </StaggerChild>
            ))}
          </Stagger>
          <Reveal delay={0.15}>
            <p className="mt-12 text-re-stone">
              Want to see the output?{" "}
              <a href="/work" className="text-re-blue hover:text-re-blue-accent underline decoration-re-blue-accent/40 underline-offset-4 transition-colors">
                The gallery shows real carousels, stories and videos from accounts we run
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow light>Next step</Eyebrow>
              <H2 light className="mt-3">
                One call. We&apos;ll map your next 90 days of content.
              </H2>
              <p className="mt-5 text-white/75 text-lg max-w-2xl">
                Bring your listing volume and your goals — we&apos;ll tell you exactly what we&apos;d
                post, film and run for your agency, and what it costs.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="/contact" variant="white">Book a strategy call</CTAButton>
                <CTAButton href="/services" variant="outline-light">
                  See all services
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
