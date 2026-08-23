"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Short form for the agents landing page — ad traffic doesn't fill in the long
 * one. It writes to the same contact_submissions table as the contact page,
 * tagged so Signature enquiries are obvious in the dashboard.
 */
export default function AgentLeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const listing = String(fd.get("listing") || "").trim();
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      agency: String(fd.get("agency") || "").trim(),
      message: listing
        ? `Signature $499 enquiry (agents page). Next listing: ${listing}`
        : "Signature $499 enquiry (agents page).",
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
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("That didn't send. Try again, or call us on 0490 036 289.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[1.75rem] border border-white/25 bg-white/10 p-8 md:p-10 backdrop-blur-sm">
        <h3 className="h-display text-3xl md:text-4xl text-white">You&apos;re in.</h3>
        <p className="mt-4 text-white/85 leading-relaxed">
          We&apos;ll call you within one business day to lock in a time. Bring the address and access
          details. That&apos;s all we need to book it.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-name" className="label-eyebrow !text-white/70 block mb-2">
            Your name *
          </label>
          <input id="lead-name" name="name" type="text" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-agency" className="label-eyebrow !text-white/70 block mb-2">
            Agency
          </label>
          <input id="lead-agency" name="agency" type="text" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-phone" className="label-eyebrow !text-white/70 block mb-2">
            Phone *
          </label>
          <input id="lead-phone" name="phone" type="tel" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="lead-email" className="label-eyebrow !text-white/70 block mb-2">
            Email *
          </label>
          <input id="lead-email" name="email" type="email" required className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="lead-listing" className="label-eyebrow !text-white/70 block mb-2">
          Where&apos;s your next listing?
        </label>
        <input
          id="lead-listing"
          name="listing"
          type="text"
          className={inputCls}
          placeholder="Suburb, or the address if you have it"
        />
      </div>

      {status === "error" && errorMsg && (
        <p className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-re-blue transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Book my shoot"} <span aria-hidden>→</span>
      </button>

      <p className="text-xs text-white/60">
        One call, no pitch deck. We book the shoot or we don&apos;t.
      </p>
    </form>
  );
}
