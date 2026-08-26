"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BookingDetails from "./BookingDetails";
import {
  STREAMS,
  getAddOn,
  getOffer,
  money,
  offersForStream,
  type BookableOffer,
  type Stream,
} from "@/lib/catalogue";
import { availableAddOns, quote, totalLabel } from "@/lib/booking-rules";
import { SITE } from "@/lib/site";

/**
 * The booking funnel.
 *
 * Three things shape it. It starts wherever the visitor clicked, so a Book
 * button on a commercial card never asks "is this commercial?" — the answer
 * arrived with them. The step after the package is the selling step, because a
 * tier upgrade next to the thing it upgrades is an easier yes than an add-on
 * list on a pricing page. And the lead is captured before anything is asked
 * about the property: name, email, phone and it's ours, with the address and
 * the date offered afterwards as a way to skip the phone tag.
 */

type StepId = "stream" | "offer" | "upsell" | "you";
type Status = "idle" | "submitting" | "error";

type Props = {
  /** From ?p= — the package the Book button they clicked was attached to. */
  initialOfferId?: string;
  /** From ?stream= — the pricing page they came from, tier not yet chosen. */
  initialStream?: Stream;
};

export default function BookingFlow({ initialOfferId, initialStream }: Props) {
  const seedOffer = getOffer(initialOfferId);
  const seedStream = seedOffer?.stream ?? initialStream;

  const [stream, setStream] = useState<Stream | undefined>(seedStream);
  const [offerId, setOfferId] = useState<string | undefined>(seedOffer?.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [dismissedStepUp, setDismissedStepUp] = useState<string[]>([]);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [booked, setBooked] = useState<{ reference: string; token: string } | null>(null);

  const offer = getOffer(offerId);
  const sellsAddOns = Boolean(offer && !offer.quote && !offer.recurring);
  const askStream = !seedStream;

  const steps = useMemo<StepId[]>(
    () => [
      ...(askStream ? (["stream"] as StepId[]) : []),
      "offer",
      ...(sellsAddOns ? (["upsell"] as StepId[]) : []),
      "you",
    ],
    [askStream, sellsAddOns]
  );

  const [step, setStep] = useState<StepId>(
    seedOffer
      ? seedOffer.quote || seedOffer.recurring
        ? "you"
        : "upsell"
      : askStream
        ? "stream"
        : "offer"
  );

  const index = Math.max(steps.indexOf(step), 0);
  const q = quote(offerId, selected, quantities);
  const rows = availableAddOns(offerId);
  const featuredRows = rows.filter((r) => !r.addOn.compact && !r.included);
  const compactRows = rows.filter((r) => r.addOn.compact || r.included);
  const stepUp = offer?.stepUpTo ? getOffer(offer.stepUpTo) : undefined;

  const go = (delta: number) => {
    const next = steps[index + delta];
    if (next) setStep(next);
  };

  const chooseStream = (next: Stream) => {
    setStream(next);
    setOfferId(undefined);
    setSelected([]);
    setStep("offer");
  };

  const chooseOffer = (next: BookableOffer) => {
    setOfferId(next.id);
    // Anything the new package already contains stops being an add-on.
    setSelected((prev) => prev.filter((id) => !next.contains.includes(id)));
    setStep(next.quote || next.recurring ? "you" : "upsell");
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const setUnits = (id: string, units: number) =>
    setQuantities((prev) => ({ ...prev, [id]: units }));

  const takeStepUp = () => {
    if (!stepUp) return;
    setOfferId(stepUp.id);
    setSelected((prev) => prev.filter((id) => !stepUp.contains.includes(id)));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      offerId,
      addOns: q.lines.map((l) => l.id),
      quantities,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      agency: String(fd.get("agency") || "").trim(),
      website: String(fd.get("website") || ""),
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setStatus("error");
      setErrorMsg("Please add your name, email and phone so we can call you back.");
      return;
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setBooked({ reference: data.reference, token: data.token });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : `That didn't send. Try again, or call us on ${SITE.phone}.`
      );
    }
  };

  /* ── Booked: the lead is safe, now ask for the rest ─────────────── */
  if (booked && stream) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[1.75rem] blue-fade gold-ring p-8 text-white md:p-10">
          <p className="label-eyebrow !text-white/85">Booking request received</p>
          <h2 className="mt-3 h-display text-3xl text-white md:text-4xl">You&apos;re in.</h2>
          <p className="mt-4 leading-relaxed text-white/85">
            We&apos;ll call within one business day to lock in a time. Your reference is{" "}
            <span className="font-medium text-white">{booked.reference}</span>.
          </p>
          {offer && (
            <p className="mt-6 border-t border-white/20 pt-5 text-sm text-white/85">
              {offer.name}
              {q.lines.length > 0 && ` + ${q.lines.length} add-on${q.lines.length > 1 ? "s" : ""}`} ·{" "}
              <span className="text-white">{totalLabel(q)}</span>
            </p>
          )}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-re-stone-light bg-white p-7 md:p-9">
          <p className="label-eyebrow">Want it faster?</p>
          <h3 className="mt-3 font-serif text-2xl text-re-ink md:text-3xl">
            Tell us about the property now and skip the phone tag.
          </h3>
          <p className="mt-3 text-re-stone leading-relaxed">
            Every answer here is one less question on the call. None of it is required — we ring you
            either way.
          </p>

          <div className="mt-8">
            <BookingDetails
              reference={booked.reference}
              token={booked.token}
              stream={stream}
              offerName={offer?.name}
              existingAddOnIds={q.lines.map((l) => l.id)}
              runningTotal={q.quoteOnly ? undefined : q.total}
              recurring={q.recurring}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ── The funnel ─────────────────────────────────────────────────── */
  const canContinue =
    (step === "stream" && Boolean(stream)) ||
    (step === "offer" && Boolean(offerId)) ||
    step === "upsell";

  return (
    <div className="pb-28 lg:pb-0">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
        <div>
          {/* Progress */}
          <div className="mb-8">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-re-stone-light">
              <span
                className="block h-full rounded-full bg-re-blue transition-all duration-500"
                style={{ width: `${((index + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em]">
              <span className="text-re-stone">
                Step {index + 1} of {steps.length}
              </span>
              <span className="text-re-blue-accent">No payment today</span>
            </div>
          </div>

          {step === "stream" && (
            <StepShell
              title="What are we booking?"
              sub="Pick the one that fits and we'll show you the right prices."
            >
              <div className="grid gap-3">
                {STREAMS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={stream === s.id}
                    onClick={() => chooseStream(s.id)}
                    className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 min-h-[76px] ${
                      stream === s.id
                        ? "border-re-blue bg-re-blue-light"
                        : "border-re-stone-light bg-white hover:border-re-blue hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="flex-1">
                      <span className="block font-serif text-xl text-re-ink">{s.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-re-stone">
                        {s.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-re-blue transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === "offer" && stream && (
            <StepShell
              title={
                stream === "monthly" ? "Which monthly package?" : "Pick your package."
              }
              sub={
                stream === "monthly"
                  ? "Sold per month. Nothing is locked in — we work to a quarterly cadence."
                  : "Every package is delivered the next business day. You can add to it on the next step."
              }
            >
              <div className="grid gap-3">
                {offersForStream(stream).map((o) => (
                  <OfferCard
                    key={o.id}
                    offer={o}
                    selected={offerId === o.id}
                    onSelect={() => chooseOffer(o)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === "upsell" && offer && (
            <StepShell
              title="Make it land harder."
              sub={`${offer.name} covers the essentials. These are what agents add when the property deserves it.`}
            >
              {stepUp && !dismissedStepUp.includes(stepUp.id) && (
                <StepUpCard
                  from={offer}
                  to={stepUp}
                  onTake={takeStepUp}
                  onDismiss={() => setDismissedStepUp((prev) => [...prev, stepUp.id])}
                />
              )}

              {q.saved > 0 && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-re-gold-thin/50 bg-white px-5 py-4">
                  <span aria-hidden className="mt-0.5 text-re-gold-thin">◆</span>
                  <p className="text-sm text-re-ink">
                    Bundled for you — that&apos;s{" "}
                    <span className="font-medium">{money(q.saved)} less</span> than buying those
                    separately.
                  </p>
                </div>
              )}

              {/* The four worth arguing for get the room to argue. */}
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredRows.map(({ addOn, included, includedReason }) => (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    included={included}
                    includedReason={includedReason}
                    selected={q.lines.some((l) => l.id === addOn.id)}
                    units={quantities[addOn.id] ?? 1}
                    onToggle={() => toggle(addOn.id)}
                    onUnits={(u) => setUnits(addOn.id, u)}
                  />
                ))}
              </div>

              {/* Everything else as tiles, two across even on the smallest
                  phone. These are things people either want or they don't, and
                  a paragraph each turned the step into a long scroll. */}
              {compactRows.length > 0 && (
                <div className="mt-6">
                  <p className="label-eyebrow mb-3">Also available</p>
                  <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {compactRows.map(({ addOn, included, includedReason }) => (
                      <AddOnCard
                        key={addOn.id}
                        addOn={addOn}
                        compact
                        included={included}
                        includedReason={includedReason}
                        selected={q.lines.some((l) => l.id === addOn.id)}
                        units={quantities[addOn.id] ?? 1}
                        onToggle={() => toggle(addOn.id)}
                        onUnits={(u) => setUnits(addOn.id, u)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 text-sm text-re-stone">
                Not sure? Skip it. We go through the property on the call and you can add anything
                then.
              </p>
            </StepShell>
          )}

          {step === "you" && (
            <StepShell
              title={offer?.quote ? "Tell us where to send the quote." : "Where do we call you?"}
              sub={
                offer?.quote
                  ? "We'll come back with a scope and a number, not a pitch."
                  : "One call to confirm the time. No payment now — listing media is invoiced after it's delivered."
              }
            >
              <form id="booking-form" onSubmit={onSubmit} noValidate className="space-y-3">
                <input name="name" type="text" required placeholder="Your name *" className={inputCls} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="phone" type="tel" required placeholder="Phone *" className={inputCls} />
                  <input name="email" type="email" required placeholder="Email *" className={inputCls} />
                </div>
                <input name="agency" type="text" placeholder="Agency" className={inputCls} />
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-px w-px opacity-0"
                />

                {status === "error" && errorMsg && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-re-blue px-8 text-base font-medium text-white transition-all duration-300 hover:bg-re-blue-accent hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "submitting"
                    ? "Sending…"
                    : offer?.quote
                      ? "Request my quote"
                      : "Request my booking"}
                  <span aria-hidden>→</span>
                </button>

                <p className="pt-1 text-xs text-re-stone">
                  We&apos;ll ask for the address on the next screen — it takes a minute and saves the
                  back and forth. Prefer to talk?{" "}
                  <a href={`tel:${SITE.phoneIntl}`} className="text-re-blue underline underline-offset-4">
                    {SITE.phone}
                  </a>
                </p>
              </form>
            </StepShell>
          )}

          {/* Step nav */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-re-stone-light pt-6">
            {index > 0 ? (
              <button
                type="button"
                onClick={() => go(-1)}
                className="text-sm text-re-stone underline underline-offset-4 transition-colors hover:text-re-blue"
              >
                Back
              </button>
            ) : (
              <Link
                href="/services"
                className="text-sm text-re-stone underline underline-offset-4 transition-colors hover:text-re-blue"
              >
                See all packages
              </Link>
            )}

            {step !== "you" && (
              <button
                type="button"
                onClick={() => go(1)}
                disabled={!canContinue}
                className="hidden min-h-[52px] items-center gap-2 rounded-full bg-re-blue px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-re-blue-accent hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 lg:inline-flex"
              >
                Continue <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop summary rail */}
        <aside className="hidden lg:block lg:sticky lg:top-28">
          <Summary offer={offer} q={q} />
        </aside>
      </div>

      {/* Mobile summary bar. Right padding clears the WhatsApp button. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 blue-fade px-4 pb-3 pt-3 pr-[4.75rem] lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">
              {offer ? offer.name : "Your booking"}
            </p>
            <p className="font-serif text-2xl text-white">
              {offer ? totalLabel(q) : "—"}
              {q.saved > 0 && (
                <span className="ml-2 align-middle text-[10px] uppercase tracking-[0.14em] text-re-gold-thin">
                  saved {money(q.saved)}
                </span>
              )}
            </p>
          </div>

          {step === "you" ? (
            <button
              type="submit"
              form="booking-form"
              disabled={status === "submitting"}
              className="inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-re-blue disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send"} <span aria-hidden>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(1)}
              disabled={!canContinue}
              className="inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-re-blue disabled:opacity-40"
            >
              Continue <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-re-stone-light bg-white px-4 py-3.5 text-re-ink placeholder:text-re-stone/50 focus:outline-none focus:border-re-blue focus:ring-2 focus:ring-re-blue/15 transition-colors min-h-[54px]";

function StepShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="h-display text-3xl text-re-ink md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-xl leading-relaxed text-re-stone">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function OfferCard({
  offer,
  selected,
  onSelect,
}: {
  offer: BookableOffer;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative w-full rounded-2xl border p-5 text-left transition-all duration-300 md:p-6 ${
        selected
          ? "border-re-blue bg-re-blue-light"
          : "border-re-stone-light bg-white hover:-translate-y-0.5 hover:border-re-blue"
      }`}
    >
      {offer.featured && (
        <span className="gold-chrome-bg absolute -top-2.5 left-5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-re-ink shadow-[0_4px_14px_rgba(196,169,108,0.4)]">
          Most popular
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-2xl text-re-ink">{offer.name}</p>
          {offer.note && <p className="mt-1.5 text-sm leading-relaxed text-re-stone">{offer.note}</p>}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-3xl text-re-blue">{offer.price}</p>
          {offer.priceSub && <p className="text-[11px] text-re-stone">{offer.priceSub}</p>}
          {!offer.priceSub && offer.products && (
            <p className="text-[11px] text-re-stone">{offer.products}</p>
          )}
        </div>
      </div>

      <ul className="mt-4 grid gap-2 border-t border-re-stone-light/70 pt-4 text-sm text-re-ink sm:grid-cols-2">
        {offer.includes.map((line) => (
          <li key={line} className="flex gap-2.5">
            <span aria-hidden className="mt-2 h-1 w-2.5 shrink-0 rounded-full bg-re-blue-accent" />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

/** The tier upgrade, sold next to the thing it upgrades. */
function StepUpCard({
  from,
  to,
  onTake,
  onDismiss,
}: {
  from: BookableOffer;
  to: BookableOffer;
  onTake: () => void;
  onDismiss: () => void;
}) {
  const delta = to.amount - from.amount;

  return (
    <div className="gold-ring blue-fade mb-6 overflow-hidden rounded-[1.5rem] p-6 text-white md:p-8">
      <span className="gold-chrome-bg inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-re-ink">
        Worth the jump
      </span>

      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg">
          <h3 className="font-serif text-2xl text-white md:text-3xl">
            Move up to {to.name}
          </h3>
          <p className="mt-3 leading-relaxed text-white/85">{to.stepUpPitch ?? to.step}</p>
        </div>
        <div className="shrink-0 text-left md:text-right">
          <p className="font-serif text-4xl text-white">+{money(delta)}</p>
          <p className="text-xs text-white/70">on top of {from.name}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onTake}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-re-blue transition-transform duration-300 hover:-translate-y-0.5"
        >
          Upgrade to {to.name} <span aria-hidden>→</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-white"
        >
          No thanks, stay on {from.name}
        </button>
      </div>
    </div>
  );
}

function AddOnCard({
  addOn,
  included,
  includedReason,
  selected,
  units,
  compact = false,
  onToggle,
  onUnits,
}: {
  addOn: ReturnType<typeof getAddOn> & {};
  included: boolean;
  includedReason?: string;
  selected: boolean;
  units: number;
  /** Tile rather than card: no pitch, two across on a phone. */
  compact?: boolean;
  onToggle: () => void;
  onUnits: (units: number) => void;
}) {
  if (!addOn) return null;

  const isBundle = Boolean(addOn.bundleOf);
  const savesOnBundle = isBundle
    ? (addOn.bundleOf ?? []).reduce((sum, id) => sum + (getAddOn(id)?.amount ?? 0), 0) - addOn.amount
    : 0;

  if (included) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-re-stone-light bg-re-ivory p-3.5 opacity-70">
        <p className="text-sm font-medium leading-snug text-re-ink line-through decoration-re-stone/50">
          {addOn.name}
        </p>
        <p className="mt-1 font-serif text-lg text-re-stone line-through">{addOn.price}</p>
        <p className="mt-auto pt-2 text-[10px] uppercase leading-tight tracking-[0.12em] text-re-blue">
          {includedReason}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`flex h-full flex-col rounded-2xl border p-3.5 transition-colors duration-300 ${
          selected ? "border-re-blue bg-re-blue-light" : "border-re-stone-light bg-white hover:border-re-blue"
        }`}
      >
        <button
          type="button"
          aria-pressed={selected}
          onClick={onToggle}
          className="flex flex-1 flex-col text-left"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium leading-snug text-re-ink">{addOn.name}</span>
            <Tick selected={selected} small />
          </span>
          <span className="mt-1 font-serif text-lg text-re-blue">
            {addOn.price}
            {addOn.quantity && (
              <span className="ml-0.5 font-sans text-[10px] text-re-stone">
                /{addOn.quantity.step}
              </span>
            )}
          </span>
        </button>

        {selected && addOn.quantity && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-re-blue/15 pt-3">
            <Stepper
              units={units}
              max={addOn.quantity.max}
              onChange={onUnits}
              label={`${addOn.name} quantity`}
              small
            />
            <p className="text-xs text-re-ink">{money(addOn.amount * units)}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        selected
          ? "border-re-blue bg-re-blue-light"
          : "border-re-stone-light bg-white hover:border-re-blue"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">
            <Tick selected={selected} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-medium text-re-ink">{addOn.name}</span>
              <span className="shrink-0 font-serif text-xl text-re-blue">
                {addOn.price}
                {addOn.quantity && (
                  <span className="ml-1 text-[11px] font-sans text-re-stone">
                    /{addOn.quantity.step}
                  </span>
                )}
              </span>
            </span>

            {savesOnBundle > 0 && (
              <span className="gold-chrome-bg mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-re-ink">
                Save {money(savesOnBundle)}
              </span>
            )}

            {addOn.pitch && (
              <span className="mt-2 block text-sm leading-relaxed text-re-stone">{addOn.pitch}</span>
            )}
          </span>
        </div>
      </button>

      {selected && addOn.quantity && (
        <div className="mt-4 flex items-center gap-3 border-t border-re-blue/15 pt-4">
          <Stepper
            units={units}
            max={addOn.quantity.max}
            onChange={onUnits}
            label={`${addOn.name} quantity`}
          />
          <p className="text-sm text-re-stone">
            {units * addOn.quantity.step} {addOn.quantity.unit} ·{" "}
            <span className="text-re-ink">{money(addOn.amount * units)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function Tick({ selected, small = false }: { selected: boolean; small?: boolean }) {
  const size = small ? "h-5 w-5" : "h-6 w-6";
  return (
    <span
      aria-hidden
      className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full border transition-colors ${
        selected ? "border-re-blue bg-re-blue text-white" : "border-re-stone-light bg-white"
      }`}
    >
      {selected && (
        <svg
          width={small ? "10" : "12"}
          height={small ? "10" : "12"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );
}

function Stepper({
  units,
  max,
  onChange,
  label,
  small = false,
}: {
  units: number;
  max: number;
  onChange: (units: number) => void;
  label: string;
  small?: boolean;
}) {
  const size = small ? "h-9 w-9 text-base" : "h-10 w-10 text-lg";
  const btn =
    `inline-flex ${size} items-center justify-center rounded-full border border-re-stone-light bg-white text-re-ink transition-colors hover:border-re-blue hover:text-re-blue disabled:opacity-40 disabled:hover:border-re-stone-light disabled:hover:text-re-ink`;

  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(1, units - 1))}
        disabled={units <= 1}
        aria-label="Fewer"
      >
        −
      </button>
      <span className="w-6 text-center font-medium tabular-nums text-re-ink">{units}</span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, units + 1))}
        disabled={units >= max}
        aria-label="More"
      >
        +
      </button>
    </div>
  );
}

function Summary({ offer, q }: { offer?: BookableOffer; q: ReturnType<typeof quote> }) {
  return (
    <div className="rounded-[1.5rem] border border-re-stone-light bg-white p-6 shadow-[0_20px_50px_rgba(30,98,224,0.08)]">
      <p className="label-eyebrow">Your booking</p>

      {!offer ? (
        <p className="mt-4 text-sm leading-relaxed text-re-stone">
          Pick a package and the price builds here as you go.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-baseline justify-between gap-3">
            <p className="font-serif text-xl text-re-ink">{offer.name}</p>
            <p className="shrink-0 font-medium text-re-ink tabular-nums">
              {offer.quote ? "—" : offer.price}
            </p>
          </div>

          {q.lines.length > 0 && (
            <ul className="mt-4 space-y-2.5 border-t border-re-stone-light pt-4 text-sm">
              {q.lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3">
                  <span className="text-re-stone">
                    {line.name}
                    {line.units > 1 && ` ×${line.units}`}
                  </span>
                  <span className="shrink-0 text-re-ink tabular-nums">{money(line.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          {q.saved > 0 && (
            <p className="mt-4 rounded-xl bg-re-blue-light px-3 py-2 text-xs text-re-blue">
              Bundled — {money(q.saved)} less than buying separately.
            </p>
          )}

          <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-re-stone-light pt-5">
            <p className="text-sm uppercase tracking-[0.14em] text-re-stone">
              {q.quoteOnly ? "Estimate" : "Total"}
            </p>
            <p className="font-serif text-3xl text-re-blue tabular-nums">{totalLabel(q)}</p>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-re-stone">
            {q.quoteOnly
              ? "Quoted against the asset once we've seen it. No obligation."
              : q.recurring
                ? "Invoiced at the start of each cycle. No long-term lock-in."
                : "Delivered the next business day. Invoiced after it's delivered, not now."}
          </p>
        </>
      )}
    </div>
  );
}
