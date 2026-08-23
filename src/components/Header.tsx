"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header className="fixed top-[var(--topbar-h)] inset-x-0 z-40 px-3 md:px-6 pt-2 md:pt-3">
      <div
        className={`mx-auto max-w-7xl h-[56px] md:h-[64px] rounded-full border border-white/15 px-4 md:px-3 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled
            ? "bg-re-blue/90 backdrop-blur-md shadow-[0_16px_40px_rgba(30,98,224,0.35)]"
            : "bg-re-blue shadow-[0_10px_30px_rgba(30,98,224,0.25)]"
        }`}
      >
        <div className="pl-2 md:pl-4">
          <Logo variant="light" />
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
                    ? "bg-white text-re-blue font-medium"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-re-blue text-sm font-medium px-6 py-2.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Book a Call
            <span aria-hidden>→</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 text-white"
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
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-re-blue text-white shadow-2xl rounded-l-[2rem] transition-transform duration-300 ${
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
              href="/contact"
              className="flex items-center justify-center w-full rounded-full bg-white text-re-blue py-3.5 hover:bg-white/90 transition-colors"
            >
              Book a Call
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
