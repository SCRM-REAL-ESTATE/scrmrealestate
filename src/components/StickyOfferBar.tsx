"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only booking bar for the agents landing page. Ad traffic scrolls a
 * long way from the hero button, so the price and the CTA follow them down.
 * Right padding keeps it clear of the WhatsApp button.
 */
export default function StickyOfferBar() {
  const [show, setShow] = useState(false);

  // The bar sits over the last line of the footer otherwise.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? "5rem" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingBottom = "";
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-30 md:hidden border-t border-white/15 blue-fade px-4 pb-3 pt-3 pr-[4.75rem] transition-transform duration-500 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <p className="font-serif text-xl text-white">$499 Signature</p>
          <p className="text-[11px] text-white/75">Agent video included</p>
        </div>
        <a
          href="#book"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-re-blue"
        >
          Book a shoot <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
