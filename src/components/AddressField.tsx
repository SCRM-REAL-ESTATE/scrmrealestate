"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The property address, asked first so everything after it has context.
 *
 * Google Places autocomplete switches on by itself when
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set, and the field is an ordinary text
 * input when it isn't — same posture as Resend and Supabase elsewhere in this
 * codebase. An agent typing the address in full is a slower booking, not a
 * broken one, so nothing here is allowed to block on Google being reachable.
 */

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = "google-maps-places";

type MapsWindow = Window & {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          opts?: Record<string, unknown>
        ) => { addListener: (e: string, cb: () => void) => void; getPlace: () => { formatted_address?: string } };
      };
    };
  };
};

function loadPlaces(): Promise<void> {
  if (!KEY) return Promise.reject(new Error("no key"));
  const w = window as MapsWindow;
  if (w.google?.maps?.places) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("places failed")));
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places&loading=async`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("places failed"));
    document.head.appendChild(script);
  });
}

export default function AddressField({
  value,
  onChange,
  label,
  placeholder,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [assisted, setAssisted] = useState(false);
  // Keep the latest onChange without re-running the effect and rebinding
  // autocomplete on every keystroke.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!KEY) return;
    let cancelled = false;

    loadPlaces()
      .then(() => {
        if (cancelled || !ref.current) return;
        const places = (window as MapsWindow).google?.maps?.places;
        if (!places) return;

        const autocomplete = new places.Autocomplete(ref.current, {
          componentRestrictions: { country: "au" },
          fields: ["formatted_address"],
          types: ["address"],
        });
        autocomplete.addListener("place_changed", () => {
          const picked = autocomplete.getPlace()?.formatted_address;
          if (picked) onChangeRef.current(picked);
        });
        setAssisted(true);
      })
      .catch(() => {
        // Typing it out still works. Nothing to tell the agent about.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <label htmlFor="property-address" className="label-eyebrow mb-2.5 block">
        {label}
      </label>
      <input
        id="property-address"
        ref={ref}
        type="text"
        value={value}
        autoFocus={autoFocus}
        autoComplete="street-address"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-re-stone-light bg-white px-4 py-4 text-base text-re-ink placeholder:text-re-stone/50 transition-colors focus:border-re-blue focus:outline-none focus:ring-2 focus:ring-re-blue/15"
      />
      <p className="mt-2 text-xs text-re-stone">
        {assisted
          ? "Start typing and pick it from the list."
          : "You can add or correct this on the call if you're not sure yet."}
      </p>
    </div>
  );
}
