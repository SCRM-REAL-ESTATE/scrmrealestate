import type { Metadata } from "next";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import ServiceIncludes from "@/components/ServiceIncludes";
import AgencyShowcase from "@/components/AgencyShowcase";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Agencies",
  description:
    "Monthly social media management for real estate agencies. 8 videos, 6 posts and 6 stories a month, planned, filmed, edited and scheduled for you. From $1,800 per month.",
};

export default function AgenciesPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="blue-fade text-white rounded-[2rem] md:rounded-[2.5rem]">
        <Container className="py-20 md:py-28">
          <Reveal>
            <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
            <h1 className="h-display text-5xl md:text-7xl text-white max-w-4xl">
              Your agency&apos;s social media. Run for you.
            </h1>
            <p className="mt-6 text-white/80 max-w-2xl text-lg md:text-xl leading-relaxed">
              8 videos, 6 posts and 6 stories every month, planned, filmed, edited and
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
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>A content system, not a freelancer with a camera.</H2>
              <p className="mt-7 text-lg md:text-xl leading-relaxed text-re-ink">
                We plan the month, film it in one batch, edit it, write the captions and
                post it. One team, start to finish. Here is what that looks like.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <AgencyShowcase />
          </Reveal>
        </Container>
      </Section>

      {/* THE PACKAGE */}
      <Section panel="white">
        <Container>
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>Every month, on schedule.</H2>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <TiltCard className="gold-ring max-w-2xl mx-auto rounded-[2rem] border border-re-stone-light bg-white p-8 md:p-12 text-center shadow-[0_24px_70px_rgba(30,98,224,0.1)]">
              <p className="label-eyebrow">Monthly Social Media Management</p>
              <p className="mt-4 font-serif text-6xl text-re-ink">
                $1,800
                <span className="ml-2 text-base font-sans text-re-stone">from / month</span>
              </p>
              <div className="mt-8 mx-auto max-w-md text-left">
                <ServiceIncludes
                  items={[
                    { label: "8 social media videos per month", examples: ["vertical", "testimonial", "agency"] },
                    { label: "6 social media posts per month", examples: ["carousel"] },
                    { label: "6 stories per month", examples: ["detail"] },
                    { label: "Monthly planning, direction & content coordination" },
                    { label: "Editing, captions & scheduling" },
                  ]}
                />
              </div>
              <p className="mt-8 text-re-stone leading-relaxed max-w-md mx-auto">
                Need more volume, paid social, or listing media rolled in? We scope it against
                your listing volume and quote it. No forced tiers.
              </p>
              <div className="mt-8 flex justify-center">
                <CTAButton href="/contact">Enquire now</CTAButton>
              </div>
            </TiltCard>
          </Reveal>
        </Container>
      </Section>

      {/* WHY */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <H2 rule>Sellers pick their agency before they call one.</H2>
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
                d: "Nobody at your office has to script, film, edit or remember to post. You show up to one filming batch a month and we do the rest.",
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
              <H2 rule>A month with us.</H2>
            </div>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10" staggerChildren={0.1}>
            {[
              {
                n: "01",
                t: "Plan",
                d: "We map the month: listings coming up, team moments and market talking points. Then we send you the plan.",
              },
              {
                n: "02",
                t: "Film",
                d: "One batch shoot at your office or on a listing. A half-day covers the whole month.",
              },
              {
                n: "03",
                t: "Edit",
                d: "We cut the videos, design the posts and write the captions, all in your branding.",
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
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <H2 light>
                One call. We&apos;ll map your next 90 days of content.
              </H2>
              <p className="mt-5 text-white/85 text-lg max-w-2xl">
                Bring your listing volume and your goals. We&apos;ll tell you exactly what we&apos;d
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
