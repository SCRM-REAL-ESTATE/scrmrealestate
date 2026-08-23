import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, H2, CTAButton, Section } from "@/components/ui";
import { Reveal, Stagger, StaggerChild } from "@/components/Reveal";
import InViewVideo from "@/components/InViewVideo";
import AgentVideoStrip from "@/components/AgentVideoStrip";
import ListingVsAgent from "@/components/ListingVsAgent";
import AgentLeadForm from "@/components/AgentLeadForm";
import StickyOfferBar from "@/components/StickyOfferBar";
import FAQAccordion from "@/components/FAQAccordion";
import { LISTING_PACKAGES, ADD_ONS_FROM } from "@/lib/pricing";
import { mediaByCategory, mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agent videos on every listing — $499",
  description:
    "Signature is $499 a listing: 18 photos, a branded floor plan, the listing video, and a vertical agent-led video with you on camera. Delivered next business day.",
  alternates: { canonical: "/agents" },
};

const SIGNATURE = LISTING_PACKAGES.find((p) => p.name === "Signature") ?? LISTING_PACKAGES[1];

const heroVideo = mediaByCategory("agency").find((item) => item.type === "video");

const faqs = [
  {
    q: "I'm not good on camera.",
    a: "Nobody is on their first one. We bring the questions, film it in short takes, and cut the rest. You're not performing — you're answering the same things you answer at an open home.",
  },
  {
    q: "Do I need a script?",
    a: "No. We ask about the property, the street and the price, and you talk. If a take goes sideways we go again. It's your voice, not a written line read off a phone.",
  },
  {
    q: "How much longer does the shoot take?",
    a: "About ten minutes. We shoot the property first, then set up for you while you're already there.",
  },
  {
    q: "Can it be branded to my agency?",
    a: "Yes. The floor plan and both videos carry your agency branding, and you get branded and unbranded exports of everything so it works on portals and on your own feed.",
  },
  {
    q: "My agency already has a photographer.",
    a: "Most agents book Signature on their own listings without changing anything at the agency level. If the agency wants to move across afterwards, we handle that separately.",
  },
  {
    q: "What if I want more than one video a month?",
    a: "Listing media covers you on the properties you're already shooting. If you want a run of videos regardless of stock, we film four pieces to camera in one sitting each month for $800 — separate from listing media.",
  },
];

export default function AgentsPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-3 md:px-6 pt-2 md:pt-3">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] blue-fade">
          <Container className="relative py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
              <Reveal direction="up">
                <span className="gold-chrome-bg inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-re-ink shadow-[0_4px_14px_rgba(196,169,108,0.4)]">
                  Most popular · Signature $499
                </span>

                <h1 className="mt-6 h-display text-4xl sm:text-5xl md:text-6xl text-white">
                  Your listing video sells the house. What sells you?
                </h1>

                <p className="mt-6 max-w-xl text-lg text-white/85 leading-relaxed">
                  $499 a listing gets you 18 photos, a branded floor plan and the listing video —
                  plus a vertical agent-led video with you on camera. Same shoot, next business day.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <CTAButton href="#book" variant="white">
                    Book your next listing
                  </CTAButton>
                  <CTAButton href="#videos" variant="outline-light">
                    Watch agent videos
                  </CTAButton>
                </div>

                <ul className="mt-9 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-7 gap-y-2.5 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {[
                    "Next business day",
                    "Branded & unbranded",
                    "Portal-ready",
                    "Per listing, no contract",
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <span aria-hidden className="text-re-gold-thin">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal direction="up" delay={0.15}>
                <div className="relative mx-auto w-full max-w-[300px]">
                  <div className="gold-ring overflow-hidden rounded-[1.75rem] border border-white/25 bg-black/20 aspect-[9/16]">
                    {heroVideo && (
                      <InViewVideo
                        src={mediaUrl(heroVideo.src)}
                        poster={heroVideo.poster ? mediaUrl(heroVideo.poster) : undefined}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-center text-sm text-white/70">
                    Filmed at the property, on the same visit as the photos.
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      {/* THE PROBLEM */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <H2>Every agent posts the same three things.</H2>
            </div>
          </Reveal>

          <Stagger className="mt-10 flex flex-wrap gap-3" staggerChildren={0.08}>
            {["Just Listed", "Open Home", "Just Sold"].map((chip) => (
              <StaggerChild key={chip}>
                <span className="inline-block rounded-full border border-re-stone-light bg-white px-6 py-3 font-serif text-lg text-re-stone">
                  {chip}
                </span>
              </StaggerChild>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-lg text-re-stone leading-relaxed">
              It works. It proves you're active. But the property is doing the talking, and the week
              that listing settles the content goes with it. Nobody in your area learned anything
              about you.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* VENDORS CHOOSE A PERSON */}
      <Section panel="white">
        <Container>
          <Reveal>
            <H2 className="max-w-3xl">Vendors don't choose a house. They choose a person.</H2>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" staggerChildren={0.09}>
            {[
              "They look you up before they call.",
              "They watch a few seconds of something.",
              "They decide whether you know their street or you're just chasing a listing.",
              "That happens whether you've filmed anything or not.",
            ].map((line, i) => (
              <StaggerChild key={line} className="flex gap-5 border-t border-re-blue/15 pt-5">
                <span className="font-serif text-2xl gold-text shrink-0">0{i + 1}</span>
                <p className="text-lg text-re-ink leading-relaxed">{line}</p>
              </StaggerChild>
            ))}
          </Stagger>

          <Reveal delay={0.12}>
            <p className="mt-12 font-serif text-2xl md:text-3xl text-re-ink max-w-2xl">
              You can't stop them looking. You can decide what they find.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* AGENT VIDEO PROOF */}
      <Section id="videos">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Eyebrow>Real agent videos</Eyebrow>
                <H2 className="mt-3">This is the bit you're not getting.</H2>
              </div>
              <p className="max-w-sm text-re-stone leading-relaxed">
                Vertical, branded to you, cut for Reels and TikTok. Play any of them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-12">
            <AgentVideoStrip />
          </Reveal>
        </Container>
      </Section>

      {/* TWO VIDEOS, ONE SHOOT */}
      <Section panel="tint">
        <Container>
          <Reveal>
            <H2 className="max-w-3xl">Two videos out of one shoot.</H2>
          </Reveal>

          <Reveal delay={0.12} className="mt-12">
            <ListingVsAgent />
          </Reveal>
        </Container>
      </Section>

      {/* THE SWITCH */}
      <Section panel="blue">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <Eyebrow light>Worth asking</Eyebrow>
              <h2 className="mt-4 h-display text-3xl sm:text-4xl md:text-5xl text-white">
                How does your current media team give you an agent-led video, on every property, for
                this price?
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">
                Most don't. You get the photos, the floor plan and the listing video, and anything
                with you in it is a separate booking, a separate invoice, or a flat no.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <Reveal delay={0.1} className="h-full">
              <div className="rounded-[1.75rem] border border-white/20 bg-white/5 p-8 md:p-9 h-full">
                <p className="label-eyebrow !text-white/60">What you get now</p>
                <ul className="mt-7 space-y-4 text-white/75">
                  {[
                    "Photos of the property",
                    "Floor plan",
                    "Listing video of the property",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-white/30" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                  <li className="flex gap-3 border-t border-white/15 pt-5 text-white">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-white/40" />
                    <span className="leading-relaxed">
                      A video with you in it — extra shoot, extra invoice, or not offered at all.
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.18} className="h-full">
              <div className="gold-ring rounded-[1.75rem] bg-white p-8 md:p-9 h-full shadow-[0_30px_70px_rgba(0,0,0,0.18)]">
                <p className="label-eyebrow">Signature · {SIGNATURE.price}</p>
                <ul className="mt-7 space-y-4 text-re-ink">
                  {SIGNATURE.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-re-blue-accent" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-re-stone-light pt-6 text-re-stone">
                  {SIGNATURE.products} · {SIGNATURE.turnaround}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.24}>
            <p className="mt-12 max-w-3xl font-serif text-2xl md:text-3xl text-white">
              You're already paying to have the property shot. Same shoot, same day, with you in it.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* WHY IT COMPOUNDS */}
      <Section>
        <Container>
          <Reveal>
            <H2 className="max-w-3xl">One listing a month is twelve agent videos a year.</H2>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" staggerChildren={0.09}>
            {[
              {
                t: "Your network sees your face",
                d: "Not just your stock. The people who already know you get a reason to remember why, week after week.",
              },
              {
                t: "The ones who aren't ready still watch",
                d: "Most sellers are twelve months out. They don't fill in a form — they follow, they lurk, and they call when the time comes.",
              },
              {
                t: "Appraisals start warmer",
                d: "When they've already heard how you talk about their market, you're not opening with your credentials. You're past that part.",
              },
              {
                t: "It works while you're not",
                d: "Someone finds you on a Sunday night, watches three videos, and calls on Monday morning.",
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

          <Reveal delay={0.12}>
            <p className="mt-12 max-w-2xl text-lg text-re-stone leading-relaxed">
              Every agent in your office has the same listing photos. None of them have your face,
              your voice, or your read on the market.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* WHAT $499 GETS YOU */}
      <Section panel="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <Eyebrow>Signature</Eyebrow>
              <H2 className="mt-3">What {SIGNATURE.price} gets you.</H2>
              <p className="mt-6 text-lg text-re-stone leading-relaxed">
                Four products off one visit, delivered next business day. Branded and unbranded
                exports so it drops straight onto the portals and onto your own feed.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CTAButton href="#book">Book your next listing</CTAButton>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-sm text-re-blue transition-colors hover:text-re-blue-accent"
                >
                  Add-ons from {ADD_ONS_FROM}
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="gold-ring rounded-[2rem] blue-fade p-9 md:p-11 text-white shadow-[0_30px_70px_rgba(30,98,224,0.3)]">
                <p className="font-serif text-6xl">{SIGNATURE.price}</p>
                <p className="mt-3 text-sm text-white/80">
                  {SIGNATURE.products} · {SIGNATURE.turnaround}
                </p>
                <ul className="mt-8 space-y-4">
                  {SIGNATURE.includes.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-white/60" />
                      <span className="leading-relaxed text-white/90">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ON THE DAY */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>On the day</Eyebrow>
              <H2 className="mt-3">Ten extra minutes. That's the whole ask.</H2>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14" staggerChildren={0.12}>
            {[
              {
                n: "01",
                t: "Book it like any other shoot",
                d: "Address, access, time. The same booking you already make when a property goes live.",
              },
              {
                n: "02",
                t: "We shoot the property, then you",
                d: "We bring the questions and film it in short takes while you're already on site. Two or three goes and it's done.",
              },
              {
                n: "03",
                t: "Next business day, everything",
                d: "Photos, floor plan, listing video and your agent video. Branded and unbranded, sized for portals and for socials.",
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

      {/* FAQ */}
      <Section panel="tint">
        <Container>
          <Reveal>
            <H2 className="max-w-2xl">What agents ask before they book.</H2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <FAQAccordion items={faqs} light={false} />
          </Reveal>
        </Container>
      </Section>

      {/* BOOK */}
      <Section panel="blue" id="book">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <Eyebrow light>Book a shoot</Eyebrow>
              <H2 light className="mt-3">
                Your next listing, with you in it.
              </H2>
              <p className="mt-6 text-lg text-white/85 leading-relaxed">
                Leave your details and we'll call to lock in a time. If it's urgent, ring{" "}
                <a href={`tel:${SITE.phoneIntl}`} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  {SITE.phone}
                </a>
                .
              </p>

              <ul className="mt-9 space-y-3 text-white/80">
                {[
                  "$499 per listing, no contract",
                  "Shot one day, delivered the next",
                  "Agent video included, not an add-on",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full bg-white/50" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-10 border-t border-white/20 pt-6 text-sm text-white/70">
                Want videos every month regardless of what you've got listed? We film four pieces to
                camera in one sitting for $800 a month —{" "}
                <Link href="/services#agent" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  see how that works
                </Link>
                .
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <AgentLeadForm />
            </Reveal>
          </div>
        </Container>
      </Section>

      <StickyOfferBar />
    </>
  );
}
