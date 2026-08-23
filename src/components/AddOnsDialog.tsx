"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ADD_ONS, ADD_ONS_FROM } from "@/lib/pricing";

/**
 * Add-ons live behind a button rather than on the page: seven line items
 * competing with three packages buries the packages. One click, full list,
 * every price visible.
 */
export default function AddOnsDialog({
  label = `Add-ons from ${ADD_ONS_FROM}`,
  variant = "solid",
}: {
  label?: string;
  variant?: "solid" | "outline" | "outline-light";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const buttonStyles = {
    solid: "bg-re-blue text-white border-re-blue hover:bg-re-blue-accent hover:border-re-blue-accent",
    outline: "bg-transparent text-re-ink border-re-stone-light hover:border-re-blue hover:text-re-blue",
    "outline-light": "bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10",
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2.5 border rounded-full px-7 py-3.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 ${buttonStyles}`}
      >
        {label}
        <span aria-hidden className="text-base leading-none">+</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-re-ink/70 backdrop-blur-sm p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Add-ons and pricing"
          >
            <motion.div
              className="gold-ring relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[1.75rem] bg-white border border-re-stone-light text-left"
              initial={{ scale: 0.97, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white flex items-start justify-between gap-6 px-7 md:px-9 pt-7 md:pt-9 pb-5 border-b border-re-stone-light">
                <div>
                  <p className="label-eyebrow">Add to any package</p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl text-re-ink">Add-ons</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-re-stone-light text-re-stone hover:border-re-blue hover:text-re-blue transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>

              <ul className="px-7 md:px-9 py-2">
                {ADD_ONS.map((addOn) => (
                  <li
                    key={addOn.name}
                    className="flex items-baseline justify-between gap-6 py-4 border-b border-re-stone-light/70 last:border-0"
                  >
                    <div>
                      <p className="text-re-ink">{addOn.name}</p>
                      {addOn.detail && (
                        <p className="mt-1 text-sm text-re-stone">{addOn.detail}</p>
                      )}
                    </div>
                    <p className="shrink-0 font-serif text-2xl text-re-blue">{addOn.price}</p>
                  </li>
                ))}
              </ul>

              <div className="px-7 md:px-9 pb-7 md:pb-9 pt-4">
                <a
                  href="/contact"
                  className="flex items-center justify-center w-full rounded-full bg-re-blue text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-re-blue-accent transition-colors"
                >
                  Enquire about add-ons
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
