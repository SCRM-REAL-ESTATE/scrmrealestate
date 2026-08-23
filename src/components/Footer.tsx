import Link from "next/link";
import Logo from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

const services = [
  { label: "Social Media Management", href: "/services#social" },
  { label: "Listing Photography & Video", href: "/services#photography" },
  { label: "Listing Packages", href: "/services#packages" },
  { label: "Add-Ons", href: "/services#packages" },
];

export default function Footer() {
  return (
    <footer className="bg-re-blue text-white/85 mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo variant="light" />
            <p className="mt-6 text-sm text-white/65 leading-relaxed max-w-sm">
              Premium content systems for luxury real estate agencies, top-performing agents, and boutique developers across Australia.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/25 hover:border-white/70 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
                </svg>
              </a>
              <a
                href={SITE.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/25 hover:border-white/70 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zm7.78 0h4.36v2.18h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 6.99V24h-4.56v-7.1c0-1.69-.03-3.86-2.35-3.86-2.36 0-2.72 1.84-2.72 3.74V24H8V8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <p className="label-eyebrow !text-white/55 mb-4">Services</p>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-white/80 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="label-eyebrow !text-white/55 mb-4">Company</p>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="label-eyebrow !text-white/55 mb-4">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${SITE.phoneIntl}`} className="text-white/80 hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="text-white/80 hover:text-white transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li className="text-white/65">Servicing Australia-wide</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/55">
          <p>© {new Date().getFullYear()} SCRM Media Real Estate. All rights reserved.</p>
          <p className="tracking-[0.18em] uppercase">A division of SCRM Media</p>
        </div>
      </div>
    </footer>
  );
}
