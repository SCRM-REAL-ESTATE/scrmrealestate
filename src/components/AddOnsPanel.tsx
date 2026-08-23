"use client";

import { useState } from "react";
import { ADD_ONS, ADD_ONS_FROM } from "@/lib/pricing";

/**
 * Add-ons open in place rather than over the page: the list unfolds across
 * the full width and pushes whatever follows further down, so nothing is
 * hidden behind an overlay.
 */
export default function AddOnsPanel({
  label = `See all add-ons from ${ADD_ONS_FROM}`,
}: {
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-3 rounded-full bg-re-blue text-white px-7 py-3.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-re-blue-accent hover:shadow-[0_10px_30px_rgba(30,98,224,0.35)]"
        >
          {open ? "Hide add-ons" : label}
          <span
            aria-hidden
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>
      </div>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-left">
            {ADD_ONS.map((addOn, i) => (
              <li
                key={addOn.name}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                className={`rounded-2xl border border-re-stone-light bg-white p-6 transition-all duration-500 hover:border-re-blue-accent/40 hover:shadow-[0_18px_44px_rgba(30,98,224,0.1)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <p className="font-serif text-3xl text-re-blue">{addOn.price}</p>
                <p className="mt-2 text-re-ink font-medium">{addOn.name}</p>
                {addOn.detail && <p className="mt-1 text-sm text-re-stone">{addOn.detail}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
