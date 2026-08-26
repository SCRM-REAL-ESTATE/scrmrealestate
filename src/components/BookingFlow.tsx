"use client";

import { useEffect, useMemo, useState } from "react";
import AddressField from "./AddressField";
import BookingDetails from "./BookingDetails";
import {
  STREAMS,
  getOffer,
  money,
  offersForStream,
  type BookableAddOn,
  type BookableOffer,
  type Stream,
} from "@/lib/catalogue";
import { groupedAddOns, quote, totalLabel, upgradeOffer, type Quote } from "@/lib/booking-rules";
import { SITE } from "@/lib/site";

/**
 * The booking funnel, built as a checkout rather than a form.
 *
 * Property → Package → Extras → Details, and every screen answers the same
 * three questions without being read: what am I choosing, what have I picked,
 * what do I press next. The primary button never moves, never changes colour
 * and always says what happens next, so an agent booking their fourth property
 * this month stops reading it entirely and just goes.
 *
 * Selecting is the only interaction. There is no checkbox beside a card, no
 * confirm step, no modal — a tap selects and arms the button, and the running
 * total moves in the summary so the consequence is visible without scrolling.
 */

type StepId = "property" | "package" | "extras" | "details";
type Status = "idle" | "submitting" | "error";

const STEP_LABEL: Record<StepId, string> = {
  property: "Property",
  package: "Package",
  extras: "Extras",
  details: "Details",
};

const WHEN_OPTIONS = ["As soon as possible", "Tomorrow", "Pick a date"];
const TIME_OPTIONS = ["Morning", "Midday", "Afternoon", "Flexible"];

/** Repeat bookers shouldn't retype their own name every week. */
const CONTACT_KEY = "scrm-booking-contact";
type Contact = { name: string; phone: string; email: string; agency: string };
const EMPTY_CONTACT: Contact = { name: "", phone: "", email: "", agency: "" };

export default function BookingFlow({
  initialOfferId,
  initialStream,
}: {
  initialOfferId?: string;
  initialStream?: Stream;
}) {
  const seedOffer = getOffer(initialOfferId);
  const seedStream = seedOffer?.stream ?? initialStream;

  const [stream, setStream] = useState<Stream | undefined>(seedStream);
  const [address, setAddress] = useState("");
  const [offerId, setOfferId] = useState<string | undefined>(seedOffer?.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [when, setWhen] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [remembered, setRemembered] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [booked, setBooked] = useState<{ reference: string; token: string } | null>(null);

  const offer = getOffer(offerId);
  const q = quote(offerId, selected, quantities);
  const needsProperty = stream !== "monthly";
  const sellsExtras = Boolean(offer && !offer.quote && !offer.recurring);

  const steps = useMemo<StepId[]>(
    () => ["property", "package", ...(sellsExtras ? (["extras"] as StepId[]) : []), "details"],
    [sellsExtras]
  );

  const [step, setStep] = useState<StepId>(seedOffer ? "property" : "property");
  const index = Math.max(steps.indexOf(step), 0);

  // Fill the contact details back in for anyone who has booked before.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONTACT_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<Contact>;
      if (!parsed?.name && !parsed?.email) return;
      setContact({ ...EMPTY_CONTACT, ...parsed });
      setRemembered(true);
    } catch {
      // A private window or blocked storage just means typing it again.
    }
  }, []);

  const go = (delta: number) => {
    const next = steps[index + delta];
    if (next) {
      setStep(next);
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    }
  };

  const chooseStream = (next: Stream) => {
    if (next === stream) return;
    setStream(next);
    setOfferId(undefined);
    setSelected([]);
    if (next === "monthly") setAddress("");
  };

  const chooseOffer = (next: BookableOffer) => {
    setOfferId(next.id);
    setSelected((prev) => prev.filter((id) => !next.contains.includes(id)));
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const upgrade = upgradeOffer(offerId, selected, quantities);

  const canContinue =
    (step === "property" && Boolean(stream) && (!needsProperty || address.trim().length > 4)) ||
    (step === "package" && Boolean(offerId)) ||
    step === "extras" ||
    (step === "details" &&
      Boolean(contact.name.trim() && contact.phone.trim() && contact.email.trim()));

  const ctaLabel =
    step === "property"
      ? "Continue to packages"
      : step === "package"
        ? offer
          ? `Continue with ${offer.name}`
          : "Choose a package"
        : step === "extras"
          ? "Continue to booking details"
          : offer?.quote
            ? "Request quote"
            : "Request booking";

  const submit = async () => {
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      offerId,
      addOns: q.lines.map((l) => l.id),
      quantities,
      address: address.trim(),
      when: when === "Pick a date" ? exactDate : when,
      timeSlot,
      notes: notes.trim(),
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      agency: contact.agency.trim(),
      website: "",
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");

      try {
        localStorage.setItem(CONTACT_KEY, JSON.stringify(contact));
      } catch {
        // Not being able to remember them is not a failed booking.
      }
      setBooked({ reference: data.reference, token: data.token });
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
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

  const advance = () => (step === "details" ? submit() : go(1));

  /* ── Booked ───────────────────────────────────────────────────── */
  if (booked && stream) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="gold-ring blue-fade rounded-[1.5rem] p-7 text-white md:p-9">
          <p className="label-eyebrow !text-white/85">Booking requested</p>
          <h2 className="mt-3 h-display text-3xl text-white md:text-4xl">You&apos;re in.</h2>
          <p className="mt-4 leading-relaxed text-white/85">
            We&apos;ll confirm the time within one business day. Reference{" "}
            <span className="font-medium text-white">{booked.reference}</span>.
          </p>
          <div className="mt-6 space-y-1 border-t border-white/20 pt-5 text-sm text-white/85">
            {address && <p className="text-white">{address}</p>}
            <p>
              {offer?.name}
              {q.lines.length > 0 && ` + ${q.lines.length} extra${q.lines.length > 1 ? "s" : ""}`} ·{" "}
              <span className="text-white">{totalLabel(q)}</span>
            </p>
            {(when || timeSlot) && (
              <p>
                {[when === "Pick a date" ? exactDate : when, timeSlot].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-re-stone-light bg-white p-6 md:p-8">
          <p className="label-eyebrow">Save us a phone call</p>
          <h3 className="mt-2.5 font-serif text-2xl text-re-ink">
            A few things about the property.
          </h3>
          <p className="mt-2.5 text-re-stone leading-relaxed">
            Answer these and the call is about confirming a time, not gathering information. None of
            it is required.
          </p>
          <div className="mt-7">
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

  /* ── The funnel ───────────────────────────────────────────────── */
  return (
    <div className="pb-24 lg:pb-0">
      <StepRail steps={steps} current={step} onJump={(s) => setStep(s)} reachedTo={index} />

      <div className="mt-7 grid items-start gap-8 lg:mt-9 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
        <div>
          {step === "property" && (
            <Step title="What are we shooting?">
              <div className="grid gap-3 sm:grid-cols-3">
                {STREAMS.map((s) => (
                  <SelectCard
                    key={s.id}
                    selected={stream === s.id}
                    onSelect={() => chooseStream(s.id)}
                    title={s.label}
                    body={s.blurb}
                  />
                ))}
              </div>

              {needsProperty && stream && (
                <div className="mt-7">
                  <AddressField
                    value={address}
                    onChange={setAddress}
                    autoFocus
                    label={stream === "commercial" ? "Asset address" : "Property address"}
                    placeholder={
                      stream === "commercial"
                        ? "45 Fitzgerald Road, Laverton North VIC"
                        : "14 Smith Street, Brighton VIC"
                    }
                  />
                </div>
              )}
            </Step>
          )}

          {step === "package" && stream && (
            <Step
              title={stream === "monthly" ? "Which monthly package?" : "Pick your package."}
              sub={
                stream === "monthly"
                  ? "Billed monthly. No lock-in."
                  : "Every one is delivered the next business day."
              }
            >
              <div className="grid gap-3">
                {offersForStream(stream).map((o) => (
                  <PackageCard
                    key={o.id}
                    offer={o}
                    selected={offerId === o.id}
                    onSelect={() => chooseOffer(o)}
                  />
                ))}
              </div>
            </Step>
          )}

          {step === "extras" && offer && (
            <Step title="Anything else?" sub={`${offer.name} covers the essentials. These are optional.`}>
              {upgrade && (
                <UpgradeCard
                  upgrade={upgrade}
                  onTake={() => chooseOffer(upgrade.to)}
                />
              )}

              {q.saved > 0 && (
                <p className="mb-5 rounded-2xl border border-re-gold-thin/50 bg-white px-5 py-3.5 text-sm text-re-ink">
                  Bundled for you — <span className="font-medium">{money(q.saved)} less</span> than
                  buying those separately.
                </p>
              )}

              <div className="space-y-7">
                {groupedAddOns(offerId).map((group) => (
                  <div key={group.id}>
                    <p className="label-eyebrow mb-3">{group.label}</p>
                    <div className="grid gap-2.5">
                      {group.rows.map(({ addOn, included, includedReason }) => (
                        <ExtraRow
                          key={addOn.id}
                          addOn={addOn}
                          included={included}
                          includedReason={includedReason}
                          added={q.lines.some((l) => l.id === addOn.id)}
                          units={quantities[addOn.id] ?? 1}
                          onToggle={() => toggle(addOn.id)}
                          onUnits={(u) => setQuantities((prev) => ({ ...prev, [addOn.id]: u }))}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {step === "details" && (
            <Step title={offer?.quote ? "Where do we send the quote?" : "Last step."}>
              {!offer?.recurring && !offer?.quote && (
                <fieldset className="mb-8">
                  <legend className="label-eyebrow mb-3">When would you like the shoot?</legend>
                  <ChipRow options={WHEN_OPTIONS} value={when} onChange={setWhen} />
                  {when === "Pick a date" && (
                    <input
                      type="date"
                      value={exactDate}
                      onChange={(e) => setExactDate(e.target.value)}
                      className={`${inputCls} mt-3`}
                    />
                  )}

                  <p className="label-eyebrow mb-3 mt-6">Preferred time</p>
                  <ChipRow options={TIME_OPTIONS} value={timeSlot} onChange={setTimeSlot} />
                </fieldset>
              )}

              <fieldset>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <legend className="label-eyebrow">Your details</legend>
                  {remembered && (
                    <button
                      type="button"
                      onClick={() => {
                        setContact(EMPTY_CONTACT);
                        setRemembered(false);
                        try {
                          localStorage.removeItem(CONTACT_KEY);
                        } catch {
                          /* nothing to clear */
                        }
                      }}
                      className="text-xs text-re-stone underline underline-offset-4 hover:text-re-blue"
                    >
                      Not you?
                    </button>
                  )}
                </div>

                <div className="grid gap-3">
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Your name *"
                    autoComplete="name"
                    className={inputCls}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="Mobile *"
                      autoComplete="tel"
                      className={inputCls}
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="Email *"
                      autoComplete="email"
                      className={inputCls}
                    />
                  </div>
                  <input
                    type="text"
                    value={contact.agency}
                    onChange={(e) => setContact((c) => ({ ...c, agency: e.target.value }))}
                    placeholder="Agency"
                    autoComplete="organization"
                    className={inputCls}
                  />
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="booking-notes" className="label-eyebrow mb-2.5 block">
                  Anything we should know?
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Access instructions, tenants, keys, parking, styling arriving…"
                  className={inputCls}
                />
              </div>

              {status === "error" && errorMsg && (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMsg}
                </p>
              )}
            </Step>
          )}

          {/* The primary action. Same size, same colour, same place, every step. */}
          <div className="mt-8">
            <PrimaryButton
              label={status === "submitting" ? "Sending…" : ctaLabel}
              disabled={!canContinue || status === "submitting"}
              onClick={advance}
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="text-sm text-re-stone underline underline-offset-4 transition-colors hover:text-re-blue"
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <p className="text-xs text-re-stone">
                No payment today · or call{" "}
                <a href={`tel:${SITE.phoneIntl}`} className="text-re-blue underline underline-offset-4">
                  {SITE.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-24">
          <Summary
            offer={offer}
            q={q}
            address={address}
            when={when === "Pick a date" ? exactDate : when}
            timeSlot={timeSlot}
            ctaLabel={status === "submitting" ? "Sending…" : ctaLabel}
            canContinue={canContinue && status !== "submitting"}
            onContinue={advance}
          />
        </aside>
      </div>

      {/* Checkout bar. The way forward is always one thumb-reach away. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-re-stone-light bg-white/95 px-4 pb-3 pr-[4.75rem] pt-3 shadow-[0_-8px_30px_rgba(26,26,26,0.08)] backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] uppercase tracking-[0.16em] text-re-stone">
              {offer ? offer.name : "Total"}
            </p>
            <p className="font-serif text-xl text-re-ink">{offer ? totalLabel(q) : "—"}</p>
          </div>
          <button
            type="button"
            onClick={advance}
            disabled={!canContinue || status === "submitting"}
            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-re-blue px-4 text-sm font-medium text-white transition-colors disabled:opacity-40"
          >
            {status === "submitting" ? "Sending…" : ctaLabel} <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-re-stone-light bg-white px-4 py-3.5 text-base text-re-ink placeholder:text-re-stone/50 transition-colors focus:border-re-blue focus:outline-none focus:ring-2 focus:ring-re-blue/15";

/* ── Chrome ─────────────────────────────────────────────────────── */

function StepRail({
  steps,
  current,
  onJump,
  reachedTo,
}: {
  steps: StepId[];
  current: StepId;
  onJump: (step: StepId) => void;
  reachedTo: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
      {steps.map((s, i) => {
        const done = i < reachedTo;
        const active = s === current;
        return (
          <li key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => done && onJump(s)}
              disabled={!done && !active}
              aria-current={active ? "step" : undefined}
              className={`rounded-full px-3 py-1.5 transition-colors ${
                active
                  ? "bg-re-blue text-white"
                  : done
                    ? "text-re-blue hover:bg-re-blue-light"
                    : "text-re-stone"
              }`}
            >
              {done && <span aria-hidden className="mr-1">✓</span>}
              {STEP_LABEL[s]}
            </button>
            {i < steps.length - 1 && (
              <span aria-hidden className="text-re-stone-light">
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Step({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="h-display text-2xl text-re-ink md:text-3xl">{title}</h2>
      {sub && <p className="mt-2 text-re-stone">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PrimaryButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-[60px] w-full items-center justify-center gap-2.5 rounded-2xl bg-re-blue px-8 text-base font-medium text-white shadow-[0_12px_30px_rgba(30,98,224,0.28)] transition-all duration-200 hover:bg-re-blue-accent hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:hover:translate-y-0"
    >
      {label} <span aria-hidden>→</span>
    </button>
  );
}

/** Selected has to be unmistakable: border, ground, tick and a word. */
function SelectCard({
  selected,
  onSelect,
  title,
  body,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex h-full flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
        selected
          ? "border-re-blue bg-re-blue-light"
          : "border-re-stone-light bg-white hover:-translate-y-0.5 hover:border-re-blue/50"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-serif text-xl text-re-ink">{title}</span>
        <Tick selected={selected} />
      </span>
      <span className="mt-2 text-sm leading-relaxed text-re-stone">{body}</span>
      {selected && (
        <span className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-re-blue">
          ✓ Selected
        </span>
      )}
    </button>
  );
}

function PackageCard({
  offer,
  selected,
  onSelect,
}: {
  offer: BookableOffer;
  selected: boolean;
  onSelect: () => void;
}) {
  const base = getOffer(offer.buildsOn);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 md:p-6 ${
        selected
          ? "border-re-blue bg-re-blue-light"
          : offer.featured
            ? "border-re-blue/40 bg-white shadow-[0_16px_40px_rgba(30,98,224,0.14)] hover:-translate-y-0.5 hover:border-re-blue"
            : "border-re-stone-light bg-white hover:-translate-y-0.5 hover:border-re-blue/50"
      }`}
    >
      {offer.featured && (
        <span className="gold-chrome-bg absolute -top-3 left-5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-re-ink shadow-[0_4px_14px_rgba(196,169,108,0.4)]">
          Most popular
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`font-serif text-re-ink ${offer.featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
            {offer.name}
          </p>
          {offer.tagline && <p className="mt-1 text-sm text-re-stone">{offer.tagline}</p>}
        </div>
        <div className="shrink-0 text-right">
          <p className={`font-serif text-re-blue ${offer.featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
            {offer.price}
          </p>
          {offer.priceSub && <p className="text-[11px] text-re-stone">{offer.priceSub}</p>}
        </div>
      </div>

      <div className="mt-4 border-t border-re-stone-light/80 pt-4">
        {base ? (
          <>
            <p className="text-sm font-medium text-re-ink">
              Everything in {base.name}, plus:
            </p>
            <ul className="mt-2 grid gap-1.5 text-sm text-re-ink sm:grid-cols-2">
              {(offer.plus ?? []).map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden className="text-re-blue">
                    +
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="grid gap-1.5 text-sm text-re-ink sm:grid-cols-3">
            {(offer.highlights ?? offer.includes).map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="mt-2 h-1 w-2 shrink-0 rounded-full bg-re-blue-accent" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-re-blue">
          ✓ {offer.name} selected
        </p>
      )}
    </button>
  );
}

/** Priced against what's in the cart, not against the sticker gap. */
function UpgradeCard({
  upgrade,
  onTake,
}: {
  upgrade: NonNullable<ReturnType<typeof upgradeOffer>>;
  onTake: () => void;
}) {
  const { to, delta, covered, plus } = upgrade;

  return (
    <div className="gold-ring blue-fade mb-6 rounded-2xl p-5 text-white md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="font-serif text-xl text-white md:text-2xl">
            Upgrade to {to.name} for another {money(delta)}
          </p>
          {covered.length > 0 && (
            <p className="mt-1.5 text-sm text-white/85">
              {to.name} already includes {covered.map((c) => c.name.toLowerCase()).join(" and ")}, so
              you stop paying for it separately.
            </p>
          )}
          <ul className="mt-3 space-y-1 text-sm text-white/90">
            {plus.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden>+</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={onTake}
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-re-blue transition-transform duration-200 hover:-translate-y-0.5"
        >
          Upgrade <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function ExtraRow({
  addOn,
  included,
  includedReason,
  added,
  units,
  onToggle,
  onUnits,
}: {
  addOn: BookableAddOn;
  included: boolean;
  includedReason?: string;
  added: boolean;
  units: number;
  onToggle: () => void;
  onUnits: (units: number) => void;
}) {
  if (included) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-re-stone-light bg-re-ivory px-4 py-3.5">
        <span aria-hidden className="text-re-blue">
          ✓
        </span>
        <p className="text-sm text-re-stone">
          <span className="text-re-ink">{addOn.name}</span>{" "}
          {includedReason?.replace(/^Already in/, "included with")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border-2 px-4 py-3.5 transition-colors duration-200 ${
        added ? "border-re-blue bg-re-blue-light" : "border-re-stone-light bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-re-ink">
            {addOn.name}
            {addOn.quantity && <span className="text-re-stone"> · per {addOn.quantity.step}</span>}
          </p>
          {addOn.pitch && !added && (
            <p className="mt-0.5 text-xs leading-relaxed text-re-stone">{addOn.pitch}</p>
          )}
        </div>

        <p className="shrink-0 font-serif text-lg text-re-blue">{addOn.price}</p>

        <button
          type="button"
          aria-pressed={added}
          onClick={onToggle}
          className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
            added
              ? "bg-re-blue text-white"
              : "border border-re-ink text-re-ink hover:bg-re-ink hover:text-white"
          }`}
        >
          {added ? "✓ Added" : "+ Add"}
        </button>
      </div>

      {added && addOn.quantity && (
        <div className="mt-3 flex items-center gap-3 border-t border-re-blue/15 pt-3">
          <Stepper units={units} max={addOn.quantity.max} onChange={onUnits} label={addOn.name} />
          <p className="text-xs text-re-stone">
            {units * addOn.quantity.step} {addOn.quantity.unit} ·{" "}
            <span className="text-re-ink">{money(addOn.amount * units)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? "" : option)}
            className={`min-h-[48px] rounded-full border-2 px-5 text-sm transition-colors ${
              on
                ? "border-re-blue bg-re-blue text-white"
                : "border-re-stone-light bg-white text-re-ink hover:border-re-blue"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Tick({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-re-blue bg-re-blue text-white" : "border-re-stone-light bg-white"
      }`}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
}: {
  units: number;
  max: number;
  onChange: (units: number) => void;
  label: string;
}) {
  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-re-stone-light bg-white text-base text-re-ink transition-colors hover:border-re-blue hover:text-re-blue disabled:opacity-40";
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`${label} quantity`}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(1, units - 1))} disabled={units <= 1} aria-label="Fewer">
        −
      </button>
      <span className="w-5 text-center text-sm font-medium tabular-nums text-re-ink">{units}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, units + 1))} disabled={units >= max} aria-label="More">
        +
      </button>
    </div>
  );
}

function Summary({
  offer,
  q,
  address,
  when,
  timeSlot,
  ctaLabel,
  canContinue,
  onContinue,
}: {
  offer?: BookableOffer;
  q: Quote;
  address: string;
  when: string;
  timeSlot: string;
  ctaLabel: string;
  canContinue: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="rounded-2xl border border-re-stone-light bg-white p-5 shadow-[0_16px_40px_rgba(30,98,224,0.08)]">
      <p className="label-eyebrow">Your shoot</p>

      {address && <p className="mt-3 font-medium leading-snug text-re-ink">{address}</p>}

      {!offer ? (
        <p className="mt-3 text-sm leading-relaxed text-re-stone">
          The price builds here as you go.
        </p>
      ) : (
        <>
          <div className="mt-3 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-re-ink">{offer.name}</span>
            <span className="shrink-0 tabular-nums text-re-ink">
              {offer.quote ? "—" : offer.price}
            </span>
          </div>

          {q.lines.map((line) => (
            <div key={line.id} className="mt-1.5 flex justify-between gap-3 text-sm">
              <span className="text-re-stone">
                {line.name}
                {line.units > 1 && ` ×${line.units}`}
              </span>
              <span className="shrink-0 tabular-nums text-re-ink">{money(line.amount)}</span>
            </div>
          ))}

          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-re-stone-light pt-4">
            <span className="text-xs uppercase tracking-[0.14em] text-re-stone">Total</span>
            <span className="font-serif text-2xl tabular-nums text-re-blue">{totalLabel(q)}</span>
          </div>
        </>
      )}

      {(when || timeSlot) && (
        <p className="mt-3 text-sm text-re-stone">{[when, timeSlot].filter(Boolean).join(" · ")}</p>
      )}

      <p className="mt-1 text-xs text-re-stone">No payment today</p>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-re-blue px-5 text-sm font-medium text-white transition-colors hover:bg-re-blue-accent disabled:cursor-not-allowed disabled:opacity-35"
      >
        {ctaLabel} <span aria-hidden>→</span>
      </button>
    </div>
  );
}
