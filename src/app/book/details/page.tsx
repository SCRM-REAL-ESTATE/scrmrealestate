import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui";
import BookingDetails from "@/components/BookingDetails";
import type { Stream } from "@/lib/catalogue";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Add your property details",
  description: "Add the address and a few details to your booking so we can schedule it faster.",
  robots: { index: false, follow: false },
};

const STREAM_IDS: Stream[] = ["residential", "commercial", "monthly"];

/**
 * The resume link from the confirmation email.
 *
 * Someone who closed the tab before finishing the optional half can still
 * finish it from their inbox, which is where a good share of them actually
 * will. The token is checked server-side when they submit.
 */
export default async function BookingDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; t?: string; stream?: string }>;
}) {
  const { ref, t, stream } = await searchParams;
  const valid = Boolean(ref && t);
  const resolvedStream: Stream = STREAM_IDS.includes(stream as Stream)
    ? (stream as Stream)
    : "residential";

  return (
    <Section className="!pt-10 md:!pt-14">
      <Container>
        <div className="mx-auto max-w-2xl">
          {!valid ? (
            <div className="rounded-[1.75rem] border border-re-stone-light bg-white p-8 text-center md:p-10">
              <p className="label-eyebrow">Link incomplete</p>
              <h1 className="mt-3 h-display text-3xl text-re-ink">
                We can&apos;t tell which booking this is.
              </h1>
              <p className="mt-4 leading-relaxed text-re-stone">
                Use the link in your confirmation email, or call{" "}
                <a href={`tel:${SITE.phoneIntl}`} className="text-re-blue underline underline-offset-4">
                  {SITE.phone}
                </a>{" "}
                and quote your reference.
              </p>
              <p className="mt-6">
                <Link href="/book" className="text-sm text-re-blue underline underline-offset-4">
                  Start a new booking
                </Link>
              </p>
            </div>
          ) : (
            <>
              <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />
              <h1 className="h-display text-3xl text-re-ink md:text-5xl">
                Let&apos;s get it scheduled.
              </h1>
              <p className="mt-4 leading-relaxed text-re-stone">
                Booking <span className="font-medium text-re-ink">{ref}</span>. Every answer here is
                one less question on the call, and none of it is required.
              </p>

              <div className="mt-10 rounded-[1.75rem] border border-re-stone-light bg-white p-7 md:p-9">
                <BookingDetails reference={ref!} token={t!} stream={resolvedStream} />
              </div>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
