/**
 * Base URL for video media. Set NEXT_PUBLIC_MEDIA_BASE_URL in .env.local / Vercel
 * to a Supabase Storage public URL (e.g. https://xxx.supabase.co/storage/v1/object/public/media)
 * for production. Falls back to /media (local dev) if unset.
 */
export const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "/media";

export const SITE = {
  name: "SCRM Media Real Estate",
  shortName: "SCRM Real Estate",
  tagline: "Premium content marketing for luxury real estate.",
  description:
    "SCRM Media Real Estate is a premium digital marketing agency partnering with luxury real estate agencies, top-performing agents, and boutique developers across Australia.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://scrmrealestate.com.au",
  phone: "0490 036 289",
  phoneIntl: "+61490036289",
  whatsappIntl: "61490036289",
  email: "sales@scrmmedia.com.au",
  automotiveUrl: "https://scrmmedia.com.au",
  socials: {
    instagram: "https://www.instagram.com/scrmmedia",
    linkedin: "https://www.linkedin.com/company/scrmmedia",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
