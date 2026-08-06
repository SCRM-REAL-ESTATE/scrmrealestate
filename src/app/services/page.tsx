import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import FAQAccordion from "@/components/FAQAccordion";
import ServiceIncludes, { type IncludeItem } from "@/components/ServiceIncludes";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Monthly social media management from $1,800, listing photography and video from $600, vertical listing video, and drone — built specifically for real estate agencies.",
};

type Service = {
  id: string;
  eyebrow: string;
  title: string;
  price: string;
  priceSub: string;
  body: string;
  includes: IncludeItem[];
  ideal: string;
  image: string;
  reverse: boolean;
};

const services: Service[] = [
  {
    id: "social",
    eyebrow: "Service 01",
    title: "Monthly Social Media Management",
    price: "From $1,800",
    priceSub: "per month",
    body:
      "A consistent monthly content system built around your business goals — brand awareness, listings, team, social proof, and local authority. Strategy and execution under one roof.",
    includes: [
      { label: "8 social media videos per month", examples: ["vertical", "testimonial"] },
      { label: "6 social media posts per month", examples: ["carousel"] },
      { label: "6 stories per month", examples: ["detail"] },
      { label: "Monthly planning, direction & content coordination" },
      { label: "Editing, captions & scheduling" },
    ],
    ideal:
      "Agencies who want to look more premium, build trust before the call, and stop posting reactively.",
    image: "/media/listings/listing-03.png",
    reverse: false,
  },
  {
    id: "photography",
    eyebrow: "Service 02",
    title: "Listing Photography & Video",
    price: "$600 – $1,000",
    priceSub: "per listing",
    body:
      "Editorial-grade listing photography paired with a horizontal listing video that makes properties look the part on portals, brochures, and social. Priced per listing, no monthly commitment required.",
    includes: [
      { label: "Professional listing video included in every package", examples: ["landscape"] },
      { label: "Editorial photography, premium colour grade", examples: ["listing"] },
      { label: "Drone add-ons from $100" },
      { label: "Same-day on-site production" },
      { label: "Optimised for portals + social" },
    ],
    ideal: "Boutique agencies and agents who want every listing to look like a flagship listing.",
    image: "/media/listings/listing-06.png",
    reverse: true,
  },
  {
    id: "vertical",
    eyebrow: "Service 03",
    title: "Vertical Social Media Listing Video",
    price: "$300 – $450",
    priceSub: "per listing",
    body:
      "Reels-first short-form video that turns one listing into a week of distribution. Built to perform on Instagram, TikTok, and Facebook Reels.",
    includes: [
      { label: "Punchy edit, hook-driven structure", examples: ["vertical"] },
      { label: "Captions and platform-ready exports" },
      { label: "$300 for monthly management clients" },
      { label: "$450 standalone" },
      { label: "Pairs with listing photography" },
    ],
    ideal: "Agents who already get good results but want their listings to travel further online.",
    image: "/media/listings/listing-09.png",
    reverse: false,
  },
];

const listingTiers = [
  { name: "Listing Essentials", price: "$600", details: "10 photos + listing video" },
  { name: "Listing Standard", price: "$800", details: "15 photos + listing video" },
  { name: "Listing Premium", price: "$1,000", details: "20 photos + listing video" },
];

const addOns = [
  {
    name: "Vertical Social Video",
    price: "$300 – $450",
    details: "$300 for monthly management clients · $450 standalone",
  },
  {
    name: "Drone — Small Add-On",
    price: "$100",
    details: "1–3 drone photos. Front of property, exterior, or context shot.",
  },
  {
    name: "Drone — Larger Add-On",
    price: "$200",
    details: "~3 extra drone shots: wide area, top of building, front, location/context.",
  },
];

const faqs = [
  {
    q: "What does the $1,800 actually cover?",
    a: "Monthly management starts at $1,800 and covers the content system — filming, editing, captions, scheduling, and the monthly planning behind it. Where an agency needs more volume, more channels, or paid distribution on top, we quote that against what you're actually trying to hit rather than pushing you into a bigger tier.",
  },
  {
    q: "Is the monthly management locked in?",
    a: "No long-term lock-ins. We work to a quarterly cadence so the system has time to compound, but you're not locked into multi-year contracts.",
  },
  {
    q: "Can I just buy listing photos without monthly management?",
    a: "Yes. Listing photography and video are sold per listing at $600, $800, or $1,000. Monthly management is separate and optional — the two work very well together, but neither requires the other.",
  },
  {
    q: "How do drone shots work?",
    a: "We add drone to listing media for $100 (1–3 shots) or $200 for a wider package — front of property, location/context, top-of-building, etc. Adjusted to suit the property.",
  },
  {
    q: "How does invoicing work?",
    a: "Monthly management is invoiced at the start of each cycle. Listing media is invoiced once the property is shot and delivered.",
  },
  {
    q: "Do you film in person each month?",
    a: "Yes. We film monthly content batches in person — typically a half-day at your office or out on a listing — to capture team, agent, and listing-based content together.",
  },
  {
    q: "Where are you based and how far do you travel?",
    a: "We're Australia-based and service Australia-wide. Most production happens in Sydney metro; for regional or interstate work we plan filming in batches to keep it efficient.",
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
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
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
            <Eyebrow>
              <span className="!text-white/85">Services & pricing</span>
            </Eyebrow>
            <h1 className="mt-3 h-display text-5xl md:text-6xl text-white max-w-3xl">
              One studio. Every layer of your real estate brand.
            </h1>
            <p className="mt-5 text-white/80 max-w-2xl text-lg">
              From your monthly content rhythm to the photography on your next listing — designed and produced by a single team, priced so you know where you stand before the call.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* SERVICES */}
      {services.map((s) => (
        <Section id={s.id} key={s.id} className={s.reverse ? "bg-white border-y border-re-stone-light" : ""}>
          <Container>
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center ${s.reverse ? "md:[direction:rtl]" : ""}`}>
              <Reveal direction={s.reverse ? "right" : "left"} className="md:col-span-7 [direction:ltr]">
                <div className="relative aspect-[4/3] overflow-hidden bg-re-stone-light group">
                  <Image src={s.image} alt={s.title} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                </div>
              </Reveal>
              <Reveal direction={s.reverse ? "left" : "right"} className="md:col-span-5 [direction:ltr]">
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="mt-3 h-display text-3xl md:text-4xl text-re-ink">{s.title}</h2>

                <p className="mt-4 font-serif text-4xl text-re-blue">
                  {s.price}
                  <span className="ml-2 text-sm font-sans text-re-stone">{s.priceSub}</span>
                </p>

                <p className="mt-5 text-re-stone leading-relaxed">{s.body}</p>

                <div className="mt-8">
                  <p className="label-eyebrow">Includes</p>
                  <ServiceIncludes items={s.includes} />
                </div>

                <div className="mt-6 bg-re-blue-light p-5 border-l-2 border-re-blue-accent">
                  <p className="label-eyebrow">Ideal for</p>
                  <p className="mt-1 text-sm text-re-ink">{s.ideal}</p>
                </div>

                <div className="mt-7">
                  <CTAButton href="/contact" variant="outline">
                    Enquire about this
                  </CTAButton>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      ))}

      {/* LISTING TIERS */}
      <Section className="bg-white border-y border-re-stone-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <Reveal direction="left" className="md:col-span-5">
              <Eyebrow>Listing media</Eyebrow>
              <H2 className="mt-3">Per-listing pricing.</H2>
              <p className="mt-5 text-re-stone leading-relaxed">
                Editorial-grade photography paired with a horizontal listing video — every package, every time. Add vertical, drone, or both below.
              </p>
              <div className="relative mt-8 aspect-[4/5] overflow-hidden bg-re-stone-light group">
                <Image
                  src="/media/listings/listing-12.png"
                  alt="Listing photography"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
            <Stagger className="md:col-span-7 grid grid-cols-1 gap-4" staggerChildren={0.08}>
              {listingTiers.map((p) => (
                <StaggerChild
                  key={p.name}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-6 md:p-7 border border-re-stone-light bg-re-ivory hover:border-re-blue/40 hover:bg-white transition-all duration-500"
                >
                  <div>
                    <p className="label-eyebrow">{p.name}</p>
                    <p className="mt-2 font-serif text-2xl text-re-ink">{p.details}</p>
                  </div>
                  <p className="font-serif text-3xl text-re-blue">{p.price}</p>
                </StaggerChild>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ADD-ONS */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl mb-12">
              <Eyebrow>Add-ons</Eyebrow>
              <H2 className="mt-3">Add depth to any listing.</H2>
              <p className="mt-5 text-re-stone leading-relaxed">
                Vertical and drone are priced individually so you can scale presentation to the property — not the other way around.
              </p>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerChildren={0.08}>
            {addOns.map((a) => (
              <StaggerChild
                key={a.name}
                className="p-7 border border-re-stone-light bg-re-ivory hover:border-re-blue/40 hover:bg-white transition-all duration-500"
              >
                <p className="label-eyebrow">{a.name}</p>
                <p className="mt-2 font-serif text-3xl text-re-blue">{a.price}</p>
                <p className="mt-3 text-sm text-re-stone leading-relaxed">{a.details}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* SCALING BEYOND */}
      <Section className="bg-re-blue text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <Reveal className="md:col-span-7">
              <Eyebrow light>Beyond the monthly system</Eyebrow>
              <H2 light className="mt-3">
                More volume, more channels, paid distribution.
              </H2>
              <p className="mt-5 text-white/75 leading-relaxed text-lg">
                Once the foundation is producing, the next move is different for every agency — higher content velocity, paid social behind the creative that's working, or the full solution with listing media rolled in. We scope it against your listing volume and goals rather than sell you a bigger tier.
              </p>
            </Reveal>
            <Reveal className="md:col-span-5" delay={0.12}>
              <div className="border border-white/20 p-8">
                <p className="label-eyebrow !text-white/70">Tailored</p>
                <p className="mt-3 font-serif text-4xl text-white">On request</p>
                <p className="mt-4 text-white/75 text-sm leading-relaxed">
                  Tell us your listing volume, current content, and where you want to be in 90 days — we&apos;ll come back with a scope and a number.
                </p>
                <div className="mt-7">
                  <CTAButton href="/contact" variant="outline-light">
                    Enquire now
                  </CTAButton>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section dark>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <Reveal direction="up" className="md:col-span-4">
              <Eyebrow light>FAQ</Eyebrow>
              <H2 light className="mt-3">
                Common questions, answered.
              </H2>
              <p className="mt-5 text-white/70 leading-relaxed">
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
      <Section className="bg-re-ivory">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Next step</Eyebrow>
              <H2 className="mt-3">Find the right service for your agency.</H2>
              <p className="mt-5 text-re-stone text-lg">
                We&apos;ll review your current content, your goals, and where the highest-leverage move is right now — before you commit to anything.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
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
