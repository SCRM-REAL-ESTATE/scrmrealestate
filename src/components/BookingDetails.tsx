"use client";

import { useMemo, useState } from "react";
import { getAddOn, money, type Stream } from "@/lib/catalogue";
import { answeredCount, questionsFor, type Question } from "@/lib/booking-questions";
import { SITE } from "@/lib/site";

/**
 * The optional half of the funnel.
 *
 * By the time this renders the lead is already in the inbox and in the table,
 * so nothing here can lose it. Everything is skippable and says so — the trade
 * is stated plainly ("this is what stops us playing phone tag"), and the two
 * questions that carry a trigger turn into an offer rather than a pitch,
 * because someone who just told us the property is empty has asked the
 * question staging answers.
 *
 * Completing it fires the second email, the loud one.
 */

type Props = {
  reference: string;
  token: string;
  stream: Stream;
  offerName?: string;
  /** Already on the order, so a trigger never offers the same thing twice. */
  existingAddOnIds?: string[];
  /** Shown so an added extra can be put in context. Absent for quotes. */
  runningTotal?: number;
  recurring?: boolean;
};

export default function BookingDetails({
  reference,
  token,
  stream,
  offerName,
  existingAddOnIds = [],
  runningTotal,
  recurring = false,
}: Props) {
  const questions = questionsFor(stream);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  const { answered, total } = answeredCount(stream, answers);
  const pct = Math.round((answered / total) * 100);

  const extrasTotal = useMemo(
    () => extras.reduce((sum, id) => sum + (getAddOn(id)?.amount ?? 0), 0),
    [extras]
  );

  const set = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const toggleExtra = (id: string) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/book/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          token,
          answers,
          extras,
          website: String(fd.get("website") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setDone(true);
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

  if (done) {
    return (
      <div className="rounded-[1.75rem] border border-re-blue/20 bg-re-blue-light p-8 md:p-10 text-center">
        <p className="label-eyebrow">Everything we need</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl text-re-ink">
          That&apos;s the slow part done.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-re-stone leading-relaxed">
          We&apos;ve got the address and the details, so the call is about locking a time rather
          than gathering information. Expect it within one business day.
        </p>
        {extras.length > 0 && (
          <p className="mx-auto mt-5 max-w-md rounded-2xl border border-re-blue/20 bg-white px-5 py-4 text-sm text-re-ink">
            Added to your booking:{" "}
            {extras.map((id) => getAddOn(id)?.name).filter(Boolean).join(", ")} · {money(extrasTotal)}
          </p>
        )}
        <p className="mt-6 border-t border-re-blue/15 pt-5 text-sm text-re-stone">
          Your reference is <span className="font-medium text-re-ink">{reference}</span>. Quote it if
          you call us on{" "}
          <a href={`tel:${SITE.phoneIntl}`} className="text-re-blue underline underline-offset-4">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-re-stone-light bg-white px-4 py-3.5 text-re-ink placeholder:text-re-stone/50 focus:outline-none focus:border-re-blue focus:ring-2 focus:ring-re-blue/15 transition-colors min-h-[52px]";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {/* Progress — deliberately shows how little is left, not how much. */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-re-stone">
            {answered} of {total} answered
          </p>
          <p className="text-xs text-re-stone">All optional</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-re-stone-light">
          <span
            className="block h-full rounded-full bg-re-blue transition-all duration-500"
            style={{ width: `${Math.max(pct, 3)}%` }}
          />
        </div>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      {questions.map((q) => (
        <QuestionField
          key={q.id}
          question={q}
          value={answers[q.id] ?? ""}
          onChange={(v) => set(q.id, v)}
          inputCls={inputCls}
          extras={extras}
          existingAddOnIds={existingAddOnIds}
          onToggleExtra={toggleExtra}
        />
      ))}

      {extras.length > 0 && !recurring && (
        <div className="rounded-2xl border border-re-blue/25 bg-re-blue-light px-5 py-4 text-sm">
          <p className="text-re-ink">
            <span className="font-medium">Added:</span>{" "}
            {extras.map((id) => getAddOn(id)?.name).filter(Boolean).join(", ")}
          </p>
          {typeof runningTotal === "number" && (
            <p className="mt-1 text-re-stone">
              {offerName ? `${offerName} + add-ons` : "Your booking"} now{" "}
              <span className="font-medium text-re-ink">{money(runningTotal + extrasTotal)}</span>. We
              confirm it on the call before anything is invoiced.
            </p>
          )}
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting" || answered === 0}
          className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-full bg-re-blue px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-re-blue-accent hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? "Sending…" : "Send these details"}
          <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-re-stone sm:max-w-[16rem]">
          {answered === 0
            ? "Answer anything above to send it through."
            : "We'll call either way — this just means we don't have to ask."}
        </p>
      </div>
    </form>
  );
}

function QuestionField({
  question: q,
  value,
  onChange,
  inputCls,
  extras,
  existingAddOnIds,
  onToggleExtra,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  inputCls: string;
  extras: string[];
  existingAddOnIds: string[];
  onToggleExtra: (id: string) => void;
}) {
  const trigger = q.triggers;
  const offer = trigger ? getAddOn(trigger.addOnId) : undefined;
  const alreadyOnOrder = trigger ? existingAddOnIds.includes(trigger.addOnId) : false;
  const showOffer =
    Boolean(trigger && offer && !alreadyOnOrder && trigger.when.includes(value));
  const taken = trigger ? extras.includes(trigger.addOnId) : false;

  return (
    <div>
      <label
        htmlFor={q.type === "choice" ? undefined : `q-${q.id}`}
        className="label-eyebrow mb-2.5 block"
      >
        {q.label}
      </label>

      {q.type === "choice" ? (
        <div role="group" aria-label={q.label} className="flex flex-wrap gap-2">
          {q.options?.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(selected ? "" : option)}
                className={`min-h-[48px] rounded-full border px-5 py-2.5 text-sm transition-colors ${
                  selected
                    ? "border-re-blue bg-re-blue text-white"
                    : "border-re-stone-light bg-white text-re-ink hover:border-re-blue"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : q.type === "textarea" ? (
        <textarea
          id={`q-${q.id}`}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className={inputCls}
        />
      ) : (
        <input
          id={`q-${q.id}`}
          type={q.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className={inputCls}
        />
      )}

      {q.hint && <p className="mt-2 text-xs text-re-stone">{q.hint}</p>}

      {/* The best upsell moment in the funnel: it answers what they just told us. */}
      {showOffer && offer && trigger && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-re-gold-thin/50 bg-white">
          <div className="gold-chrome-bg h-1 w-full" />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-serif text-lg text-re-ink">
                {offer.name} · {offer.price}
                {offer.quantity ? ` per ${offer.quantity.step}` : ""}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-re-stone">{trigger.line}</p>
            </div>
            <button
              type="button"
              aria-pressed={taken}
              onClick={() => onToggleExtra(trigger.addOnId)}
              className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors ${
                taken
                  ? "bg-re-blue text-white"
                  : "border border-re-ink text-re-ink hover:bg-re-ink hover:text-white"
              }`}
            >
              {taken ? "Added ✓" : `Add ${offer.price}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
