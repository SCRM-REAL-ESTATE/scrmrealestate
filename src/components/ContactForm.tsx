"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Eyebrow } from "@/components/ui";

/** Mirrors what is actually sold: the three listing packages, the two
 *  monthly packages, and add-ons. Keep in step with src/lib/pricing.ts. */
const serviceOptions = [
  "Listing $349",
  "Signature $499",
  "Premiere $899",
  "Agent content $800/mo",
  "Agency management from $1,800/mo",
  "Add-ons",
  "Not sure yet",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [services, setServices] = useState<string[]>([]);

  const toggleService = (s: string) => {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
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
      message: String(fd.get("message") || "").trim(),
      services,
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and a short message.");
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("contact_submissions").insert([payload]);
        if (error) throw error;
      } else {
        // Fallback: log payload locally during local dev when Supabase isn't configured
        console.warn("Supabase not configured. Submission preview:", payload);
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        "Something went wrong sending your message. Please try again, or email us directly."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="bg-re-blue-light rounded-[1.75rem] border-l-2 border-re-blue-accent p-8 md:p-10">
        <Eyebrow>Message received</Eyebrow>
        <h2 className="mt-3 h-display text-3xl md:text-4xl text-re-ink">
          Thanks. We'll be in touch within 1 business day.
        </h2>
        <p className="mt-4 text-re-stone">
          In the meantime, you're welcome to message us on WhatsApp or call directly using the details on the right.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full bg-white border border-re-stone-light rounded-2xl px-4 py-3 text-re-ink placeholder:text-re-stone/70 focus:outline-none focus:border-re-blue transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div>
        <Eyebrow>Tell us about your agency</Eyebrow>
        <h2 className="mt-3 h-display text-3xl md:text-4xl text-re-ink">
          Send us a message.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="label-eyebrow block mb-2">
            Your name *
          </label>
          <input id="name" name="name" type="text" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="agency" className="label-eyebrow block mb-2">
            Agency
          </label>
          <input id="agency" name="agency" type="text" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="label-eyebrow block mb-2">
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="label-eyebrow block mb-2">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputCls} />
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-3">What are you interested in?</p>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((s) => {
            const selected = services.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleService(s)}
                className={`px-4 py-2.5 text-sm border rounded-full transition-colors min-h-[44px] ${
                  selected
                    ? "bg-re-blue text-white border-re-blue"
                    : "bg-white text-re-ink border-re-stone-light hover:border-re-blue"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label-eyebrow block mb-2">
          Tell us a bit about what you're looking for *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputCls}
          placeholder="A few sentences about your agency, current content, and what you'd like help with."
        />
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-re-blue text-white px-8 py-4 text-sm hover:bg-re-blue-accent hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
      >
        {status === "submitting" ? "Sending…" : "Send message"} <span aria-hidden>→</span>
      </button>

      <p className="text-xs text-re-stone">
        By submitting, you agree to be contacted about your enquiry. We never share details with third parties.
      </p>
    </form>
  );
}
