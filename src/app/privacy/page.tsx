import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container, Section } from "@/components/ui";
import { SITE } from "@/lib/site";

/**
 * Privacy policy.
 *
 * The URL is referenced from Meta lead ad forms, so it has to stay at exactly
 * /privacy and stay publicly indexable. Don't add noindex, don't rename it, and
 * don't put it behind anything.
 *
 * The wording is supplied and legal, so it is set verbatim rather than edited
 * to match the voice of the rest of the site.
 */

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  share: "Privacy Policy",
  description: "How SCRM Media collects, uses and stores personal information, and how to access, correct or delete it.",
  path: "/privacy",
  card: "privacy",
  cardAlt: "SCRM Media Real Estate",
  robots: { index: true, follow: true },
});

/** Shared spacing so every heading in the document sits the same. */
const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-12 font-serif text-2xl md:text-3xl text-re-ink">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 text-re-stone leading-relaxed">{children}</p>
);

export default function PrivacyPage() {
  return (
    <Section>
      <Container>
        <article className="mx-auto max-w-2xl">
          <h1 className="h-display text-4xl md:text-5xl text-re-ink">Privacy Policy</h1>
          <p className="mt-4 text-re-stone">
            SCRM Media (&quot;we&quot;, &quot;us&quot;) — scrmrealestate.com.au
          </p>
          <p className="mt-1 text-sm text-re-stone">Last updated: September 2026</p>

          <H>What we collect</H>
          <P>
            When you enquire with us or submit a form — on this website or through our ads on
            Facebook and Instagram — we collect the details you provide: your name, email
            address, phone number, and the agency or business you work with.
          </P>
          <P>
            We may also collect standard website analytics data (pages visited, device type)
            through cookies and similar technologies, including the Meta Pixel, to measure and
            improve our advertising.
          </P>

          <H>How we use it</H>
          <P>We use your details to:</P>
          <ul className="mt-4 space-y-3 text-re-stone">
            {[
              "respond to your enquiry and provide quotes;",
              "book and deliver photography, video and media services;",
              "send you information about our services, which you can opt out of at any time.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 rounded-full bg-re-blue-accent" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
          <P>We do not sell your personal information to anyone.</P>

          <H>Storage and sharing</H>
          <P>
            Your information is stored securely and accessed only by our team. We share it only
            with service providers we use to run our business (for example, our booking,
            invoicing and email tools), and only as needed to deliver our services. Some of
            these providers may store data outside Australia.
          </P>
          <P>
            Leads submitted through Facebook or Instagram forms are also processed by Meta under
            Meta&apos;s own privacy policy.
          </P>

          <H>Access, correction and deletion</H>
          <P>
            You can ask us at any time to access, correct, or delete the personal information we
            hold about you. Email us and we&apos;ll action it promptly.
          </P>

          <H>Contact</H>
          <P>SCRM Media</P>
          <p className="mt-2 text-re-stone leading-relaxed">
            Email:{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-re-blue underline decoration-re-blue-accent/40 underline-offset-4 transition-colors hover:text-re-blue-accent"
            >
              {SITE.email}
            </a>
            <br />
            Phone:{" "}
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="text-re-blue underline decoration-re-blue-accent/40 underline-offset-4 transition-colors hover:text-re-blue-accent"
            >
              {SITE.phone}
            </a>
          </p>
          <P>
            We handle personal information in accordance with the Australian Privacy Principles
            under the Privacy Act 1988 (Cth). If you have a concern about how we&apos;ve handled
            your information, contact us first — if unresolved, you can contact the Office of the
            Australian Information Commissioner (
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noreferrer"
              className="text-re-blue underline decoration-re-blue-accent/40 underline-offset-4 transition-colors hover:text-re-blue-accent"
            >
              oaic.gov.au
            </a>
            ).
          </P>
        </article>
      </Container>
    </Section>
  );
}
