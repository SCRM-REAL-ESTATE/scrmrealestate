"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";
import { useHideOnScroll } from "@/lib/useHideOnScroll";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hidden = useHideOnScroll();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-[var(--topbar-h)] inset-x-0 z-40 px-3 md:px-6 pt-2 md:pt-3 transition-all duration-500 ${
        hidden ? "-translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl h-[56px] md:h-[64px] rounded-full border border-re-ink/[0.06] bg-white/95 backdrop-blur-md px-4 md:px-3 flex items-center justify-between gap-4 transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_16px_44px_rgba(26,26,26,0.14)]"
            : "shadow-[0_8px_28px_rgba(26,26,26,0.08)]"
        }`}
      >
        <div className="pl-2 md:pl-4">
          <Logo variant="dark" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 tracking-tight transition-colors duration-200 ${
                  active
                    ? "bg-re-blue text-white font-medium"
                    : "text-re-ink/75 hover:text-re-ink hover:bg-re-ink/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-re-blue text-white text-sm font-medium px-6 py-2.5 hover:bg-re-blue-accent hover:shadow-[0_10px_28px_rgba(30,98,224,0.35)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Book a Shoot
            <span aria-hidden>→</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 text-re-ink"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </div>

    </header>

      {/*
        Mobile drawer — deliberately a sibling of <header>, not a child. The
        scrolled header carries backdrop-blur, and a backdrop-filter makes its
        element the containing block for fixed descendants: nested here, the
        drawer was being clipped to the header bar and rendered under the
        top bar's z-50. Outside it, `fixed inset-0` means the viewport again.
      */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm blue-fade text-white shadow-2xl rounded-l-[2rem] transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/15">
            <Logo variant="light" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-11 w-11 -mr-2 text-white"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col px-5 py-6 gap-1" aria-label="Primary mobile">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-4 text-2xl font-serif border-b border-white/10 ${
                    active ? "text-white" : "text-white/85"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-white/50 text-base">→</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-5 mt-2 space-y-3 text-sm">
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full rounded-full bg-white text-re-blue py-3.5 hover:bg-white/90 transition-colors"
            >
              Book a Shoot
            </Link>
            <a href={`tel:${SITE.phoneIntl}`} className="block text-white/85">
              <span className="label-eyebrow !text-white/55 block mb-1">Call</span>
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block text-white/85">
              <span className="label-eyebrow !text-white/55 block mb-1">Email</span>
              {SITE.email}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
