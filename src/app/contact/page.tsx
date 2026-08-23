import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a strategy call with SCRM Media Real Estate. Tell us about your agency, your goals, and we'll suggest the right next move.",
};

export default function ContactPage() {
  return (
    <>
      <section className="px-3 md:px-6 pt-2 md:pt-3">
      <div className="blue-fade text-white rounded-[2rem] md:rounded-[2.5rem]">
        <Container className="py-20 md:py-24">
          <Reveal>
            <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
            <h1 className=" h-display text-5xl md:text-6xl text-white max-w-3xl">
              Let's talk about how your agency shows up online.
            </h1>
            <p className="mt-5 text-white/80 max-w-2xl text-lg">
              A 30-minute call is enough to map what your content and listing media should look like over the next 90 days.
            </p>
          </Reveal>
        </Container>
      </div>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Form */}
            <Reveal direction="left" className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            {/* Info panel */}
            <Reveal direction="right" delay={0.15} as="aside" className="lg:col-span-5">
              <div className="rounded-[1.75rem] bg-white border border-re-stone-light p-8 md:p-10 shadow-[0_16px_44px_rgba(30,98,224,0.06)]">
                <Eyebrow>Direct contact</Eyebrow>
                <ul className="mt-5 space-y-5">
                  <li>
                    <p className="label-eyebrow">Phone</p>
                    <a
                      href={`tel:${SITE.phoneIntl}`}
                      className="block mt-1 font-serif text-2xl text-re-ink hover:text-re-blue transition-colors"
                    >
                      {SITE.phone}
                    </a>
                  </li>
                  <li>
                    <p className="label-eyebrow">Email</p>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="block mt-1 font-serif text-xl text-re-ink hover:text-re-blue transition-colors break-all"
                    >
                      {SITE.email}
                    </a>
                  </li>
                  <li>
                    <p className="label-eyebrow">WhatsApp</p>
                    <a
                      href={`https://wa.me/${SITE.whatsappIntl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block mt-1 font-serif text-xl text-re-ink hover:text-re-blue transition-colors"
                    >
                      Message us →
                    </a>
                  </li>
                </ul>

                <hr className="my-8 border-re-stone-light" />

                <Eyebrow>What happens next</Eyebrow>
                <ol className="mt-5 space-y-4 text-sm text-re-ink">
                  {[
                    "We reply within 1 business day to schedule a 30-minute call.",
                    "On the call, we map your goals, current content, and the highest-leverage move.",
                    "If we're a fit, you'll receive a tailored proposal within 48 hours.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-serif text-re-blue-accent text-xl leading-none w-6">
                        0{i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>

                <hr className="my-8 border-re-stone-light" />

                <p className="text-sm text-re-stone leading-relaxed">
                  We service agencies Australia-wide. Most production happens in Sydney metro; for regional/interstate clients, filming is planned in batches.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
