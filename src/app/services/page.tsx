import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, H2, CTAButton, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import FAQAccordion from "@/components/FAQAccordion";
import AddOnsPanel from "@/components/AddOnsPanel";
import ListingPackages from "@/components/ListingPackages";
import AgentContentCard from "@/components/AgentContentCard";
import PairsWellWith from "@/components/PairsWellWith";
import { ADD_ONS_FROM, VACANT_PROPERTY } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Listing packages from $349 with photos, floor plan and video, agent content at $800 a month, and monthly social media management from $1,800, built specifically for real estate.",
};

const faqs = [
  {
    q: "What does the $1,800 actually cover?",
    a: "Monthly management starts at $1,800 and covers the content system: filming, editing, captions, scheduling, and the monthly planning behind it. Where an agency needs more volume, more channels, or paid distribution on top, we quote that against what you're actually trying to hit rather than pushing you into a bigger tier.",
  },
  {
    q: "Is the monthly management locked in?",
    a: "No long-term lock-ins. We work to a quarterly cadence so the system has time to compound, but you're not locked into multi-year contracts.",
  },
  {
    q: "I already get an agent video with Signature. Why pay $800 a month?",
    a: "They do different jobs. The Signature video is shot at the property and sells that listing. None of the four monthly videos is about a property: who you are, how you work, what you know about your area. Listing content only exists while you have stock, so it stops the month you go quiet. The monthly four run either way, and we plan and post them for you.",
  },
  {
    q: "Can I just buy listing photos without monthly management?",
    a: "Yes. Listing packages are sold per listing at $349, $499, or $899. Monthly management is separate and optional. The two work very well together, but neither requires the other.",
  },
  {
    q: "How does aerial work?",
    a: "Aerial photography and footage is included in Premiere. On Listing and Signature it's a $150 add-on, adjusted to suit the property: front elevation, location and context, top-of-building.",
  },
  {
    q: "How does invoicing work?",
    a: "Monthly management is invoiced at the start of each cycle. Listing media is invoiced once the property is shot and delivered.",
  },
  {
    q: "Do you film in person each month?",
    a: "Yes. We film monthly content batches in person, typically a half-day at your office or out on a listing, to capture team, agent, and listing-based content together.",
  },
  {
    q: "Where are you based and how far do you travel?",
    a: "We're mainly based in Melbourne and shoot right across Melbourne metro, with production in Sydney metro as well. We service Australia-wide, and for regional or interstate work we plan filming in batches to keep it efficient.",
  },
  {
    q: "Can you handle paid social as well?",
    a: "Yes. We typically wait until your organic system is producing strong creative before scaling spend, then quote distribution on top of management.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="relative min-h-[60vh] flex items-end overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <div className="absolute inset-0">
          <Image
            src="/media/listings/listing-02.png"
            alt="Editorial real estate marketing"
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
            <h1 className="h-display text-5xl md:text-6xl text-white max-w-3xl">
              Packages priced before the call.
            </h1>
            <p className="mt-5 text-white/85 max-w-2xl text-lg">
              Listing media per listing, agent content per month, full management for agencies. Pick the layer you need.
            </p>
          </Reveal>
        </Container>
      </div>
      </section>

      {/* LISTING PACKAGES */}
      <Section id="packages" panel="white">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-xl">
                <H2 rule>Listing packages.</H2>
                <p className="mt-5 text-re-stone leading-relaxed">
                  Photos, a branded floor plan and video in every package. Delivered next business day.
                </p>
              </div>
              <Link
                href="#add-ons"
                className="group inline-flex items-center gap-2 rounded-full border border-re-stone-light px-7 py-3.5 text-xs tracking-[0.2em] uppercase text-re-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-re-blue hover:text-re-blue"
              >
                Add-ons from {ADD_ONS_FROM}
                <span aria-hidden className="text-base leading-none">+</span>
              </Link>
            </div>
          </Reveal>

          <ListingPackages />
          <PairsWellWith />
        </Container>
      </Section>

      {/* AGENT PACKAGE */}
      <Section id="agent">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>What every agent is missing.</H2>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-10">
            <AgentContentCard />
          </Reveal>
        </Container>
      </Section>

      {/* ADD-ONS */}
      <Section id="add-ons">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>Add depth to any listing.</H2>
              <p className="mt-5 text-re-stone leading-relaxed text-lg">
                Twilight, aerial, virtual staging, 3D tours and more, priced individually from {ADD_ONS_FROM} so you scale presentation to the property.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <AddOnsPanel />
          </Reveal>
        </Container>
      </Section>

      {/* ALREADY HAVE PHOTOS */}
      <Section id="vacant-property">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>{VACANT_PROPERTY.heading}</H2>
              <p className="mt-6 text-lg text-re-stone leading-relaxed">
                {VACANT_PROPERTY.intro}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 flex flex-wrap justify-center gap-5 md:gap-6 items-stretch">
            {VACANT_PROPERTY.options.map((option, i) => (
              <Reveal
                key={option.name}
                delay={0.08 * i}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div
                  className={`flex h-full flex-col rounded-[1.75rem] border p-8 md:p-9 transition-shadow duration-500 ${
                    option.featured
                      ? "gold-ring blue-fade text-white border-re-blue hover:shadow-[0_30px_70px_rgba(30,98,224,0.35)]"
                      : "bg-white border-re-stone-light hover:shadow-[0_24px_60px_rgba(30,98,224,0.12)]"
                  }`}
                >
                  <p className={`label-eyebrow ${option.featured ? "!text-white/85" : ""}`}>
                    {option.name}
                  </p>
                  <p className={`mt-3 font-serif text-5xl ${option.featured ? "text-white" : "text-re-ink"}`}>
                    {option.price}
                  </p>

                  <ul
                    className={`mt-6 space-y-3 text-sm ${option.featured ? "text-white/90" : "text-re-ink"}`}
                  >
                    {option.includes.map((line) => (
                      <li key={line} className="flex gap-3">
                        <span
                          className={`mt-2 h-1 w-3 shrink-0 rounded-full ${
                            option.featured ? "bg-white/60" : "bg-re-blue-accent"
                          }`}
                        />
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    {option.note && (
                      <p className={`mb-5 text-sm ${option.featured ? "text-white/85" : "text-re-stone"}`}>
                        {option.note}
                      </p>
                    )}
                    <CTAButton href="/contact" variant={option.featured ? "white" : "solid"}>
                      Enquire now
                    </CTAButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 text-center text-sm text-re-stone">
              {VACANT_PROPERTY.smallPrint}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* SCALING BEYOND */}
      <Section panel="blue">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <Reveal className="md:col-span-7">
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <H2 light>
                More volume, more channels, paid distribution.
              </H2>
              <p className="mt-5 text-white/85 leading-relaxed text-lg">
                Higher content velocity, paid social behind the creative that&apos;s working, or the full solution with listing media rolled in. All scoped against your listing volume and goals.
              </p>
            </Reveal>
            <Reveal className="md:col-span-5" delay={0.12}>
              <div className="gold-ring rounded-[1.75rem] border border-white/20 bg-white/[0.06] p-8">
                <p className="label-eyebrow !text-white/85">Tailored</p>
                <p className="mt-3 font-serif text-4xl text-white">On request</p>
                <p className="mt-4 text-white/85 text-sm leading-relaxed">
                  Tell us your listing volume, current content, and where you want to be in 90 days. We&apos;ll come back with a scope and a number.
                </p>
                <div className="mt-7">
                  <CTAButton href="/contact" variant="white">
                    Enquire now
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section panel="blue">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <Reveal direction="up" className="md:col-span-4">
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <H2 light>
                Common questions, answered.
              </H2>
              <p className="mt-5 text-white/85 leading-relaxed">
                Still unsure if we&apos;re a fit? A 30-minute call is the fastest way to find out.
              </p>
            </Reveal>
            <Reveal direction="up" className="md:col-span-8" delay={0.15}>
              <FAQAccordion items={faqs} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <span aria-hidden className="gold-chrome-bg mx-auto mb-5 block h-[3px] w-12 rounded-full" />
              <H2>Find the right package for you.</H2>
              <p className="mt-5 text-re-stone text-lg">
                We&apos;ll review your current content, your goals, and where the highest-leverage move is right now, before you commit to anything.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <CTAButton href="/contact">Book a strategy call</CTAButton>
                <CTAButton href="/work" variant="outline">
                  See the work
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
