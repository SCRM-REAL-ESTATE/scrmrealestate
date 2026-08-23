"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LISTING_PACKAGES } from "@/lib/pricing";

const SIGNATURE = LISTING_PACKAGES.find((p) => p.name === "Signature") ?? LISTING_PACKAGES[1];

const VOLUME = ["1–2", "3–5", "6–10", "10 or more"];

const AGENT_VIDEO = "Agent video";
const NOTHING = "Nothing yet";
const CURRENT = ["Photos", "Floor plan", "Listing video", AGENT_VIDEO, "Aerial", NOTHING];

const TOTAL = 3;

type Status = "idle" | "submitting" | "error";

/**
 * Three-step qualifier in the hero. Ad traffic answers two taps before it is
 * asked for a phone number, and step two doubles as the argument: almost
 * nobody ticks "Agent video", which is the whole reason the page exists.
 */
export default function AgentFunnel() {
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState("");
  const [current, setCurrent] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleCurrent = (option: string) => {
    setCurrent((prev) => {
      if (option === NOTHING) return prev.includes(NOTHING) ? [] : [NOTHING];
      const next = prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev.filter((x) => x !== NOTHING), option];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      agency: String(fd.get("agency") || "").trim(),
      message: [
        "Signature $499 enquiry (agents funnel).",
        volume && `Listings: ${volume} a month.`,
        `Currently gets: ${current.length ? current.join(", ") : "not answered"}.`,
      ]
        .filter(Boolean)
        .join(" "),
      services: ["Signature $499"],
    };

    if (!payload.name || !payload.email || !payload.phone) {
      setStatus("error");
      setErrorMsg("Please add your name, email and phone so we can call you back.");
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("contact_submissions").insert([payload]);
        if (error) throw error;
      } else {
        console.warn("Supabase not configured. Submission preview:", payload);
        await new Promise((r) => setTimeout(r, 600));
      }
      setDone(true);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("That didn't send. Try again, or call us on 0490 036 289.");
    }
  };

  const cardCls =
    "rounded-2xl border bg-white p-8 md:p-9 shadow-[0_30px_70px_rgba(0,0,0,0.18)] border-re-stone-light";

  if (done) {
    return (
      <div className={`${cardCls} min-h-[420px] flex flex-col justify-center`}>
        <p className="label-eyebrow">Booked in</p>
        <h2 className="mt-4 h-display text-3xl text-re-ink">You&apos;re in.</h2>
        <p className="mt-4 text-re-stone leading-relaxed">
          We&apos;ll call within one business day to lock in a time. Bring the address and access
          details, that&apos;s all we need.
        </p>
        <p className="mt-6 border-t border-re-stone-light pt-5 text-sm text-re-stone">
          Signature · {SIGNATURE.price} per listing · agent video on every one.
        </p>
      </div>
    );
  }

  const optionCls = (selected: boolean) =>
    `flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-left text-[13px] sm:text-sm transition-colors min-h-[52px] ${
      selected
        ? "border-re-blue bg-re-blue-light text-re-ink"
        : "border-re-stone-light bg-white text-re-ink hover:border-re-blue"
    }`;

  const tick = (selected: boolean) => (
    <span
      aria-hidden
      className={`hidden sm:inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
        selected ? "border-re-blue bg-re-blue text-white" : "border-re-stone-light"
      }`}
    >
      {selected && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  );

  const inputCls =
    "w-full rounded-2xl border border-re-stone-light bg-white px-4 py-3 text-re-ink placeholder:text-re-stone/60 focus:outline-none focus:border-re-blue transition-colors";

  const missingAgentVideo = current.length > 0 && !current.includes(AGENT_VIDEO);

  return (
    <div className={cardCls}>
      {/* Progress */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-re-stone-light">
        <span
          className="block h-full rounded-full bg-re-blue transition-all duration-500"
          style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em]">
        <span className="text-re-stone">
          Step {step + 1} of {TOTAL}
        </span>
        <span className="text-re-blue-accent">Takes a minute</span>
      </div>

      <div className="mt-7 min-h-[340px]">
        {step === 0 && (
          <>
            <h2 className="font-serif text-2xl text-re-ink">How many listings do you take a month?</h2>
            <p className="mt-2 text-sm text-re-stone">Pick the closest.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {VOLUME.map((option) => {
                const selected = volume === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setVolume(option);
                      setStep(1);
                    }}
                    className={optionCls(selected)}
                  >
                    <span>{option}</span>
                    {tick(selected)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-serif text-2xl text-re-ink">What does your current supplier deliver?</h2>
            <p className="mt-2 text-sm text-re-stone">Pick as many as you like.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {CURRENT.map((option) => {
                const selected = current.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCurrent(option)}
                    className={optionCls(selected)}
                  >
                    <span>{option}</span>
                    {tick(selected)}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-re-blue px-8 text-sm font-medium text-white transition-colors hover:bg-re-blue-accent"
            >
              Continue <span aria-hidden>→</span>
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={onSubmit} noValidate>
            <h2 className="font-serif text-2xl text-re-ink">Where do we call you?</h2>
            {missingAgentVideo ? (
              <p className="mt-2 text-sm text-re-stone">
                No agent video in that list. Signature includes one on every listing.
              </p>
            ) : (
              <p className="mt-2 text-sm text-re-stone">We&apos;ll come back with a time, not a pitch.</p>
            )}

            <div className="mt-6 space-y-3">
              <input name="name" type="text" required placeholder="Your name *" className={inputCls} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="phone" type="tel" required placeholder="Phone *" className={inputCls} />
                <input name="email" type="email" required placeholder="Email *" className={inputCls} />
              </div>
              <input name="agency" type="text" placeholder="Agency" className={inputCls} />
            </div>

            {status === "error" && errorMsg && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-re-blue px-8 text-sm font-medium text-white transition-colors hover:bg-re-blue-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Book my shoot"} <span aria-hidden>→</span>
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-re-stone-light pt-5">
        <p className="text-xs text-re-stone">
          Signature · <span className="text-re-ink">{SIGNATURE.price}</span> per listing · agent video
          included
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="shrink-0 text-xs text-re-stone underline underline-offset-4 hover:text-re-blue"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
