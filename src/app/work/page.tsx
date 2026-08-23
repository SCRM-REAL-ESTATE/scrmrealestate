import type { Metadata } from "next";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import WorkGallery from "@/components/WorkGallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A look at recent SCRM Media Real Estate work — listing photography, vertical video, social content, and brand stories.",
};

export default function WorkPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="blue-fade text-white rounded-[2rem] md:rounded-[2.5rem]">
        <Container className="py-20 md:py-28">
          <Reveal>
            <Eyebrow light>Selected work</Eyebrow>
            <h1 className="mt-3 h-display text-5xl md:text-6xl text-white max-w-3xl">
              Work that earns trust before the call.
            </h1>
            <p className="mt-5 text-white/80 max-w-2xl text-lg">
              A snapshot of listings, social content, and brand work produced for agencies, agents, and developers.
            </p>
          </Reveal>
        </Container>
      </div>
      </section>

      <WorkGallery />

      {/* PLACEHOLDER NOTICE */}
      <Section className="bg-re-ivory border-t border-re-stone-light">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto bg-white border border-re-stone-light rounded-[2rem] p-8 md:p-12 text-center">
              <Eyebrow>A note on this gallery</Eyebrow>
              <H2 className="mt-3">More than fits on one page.</H2>
              <p className="mt-5 text-re-stone leading-relaxed text-lg">
                The strongest examples of our work — full account dashboards, results, vertical reels, and live campaigns — are best shown on a call. We'll walk you through what worked, what didn't, and what we'd do for your agency.
              </p>
              <div className="mt-8 flex justify-center">
                <CTAButton href="/contact">Book a walk-through</CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
