import manifest from "@/data/media.json";

/**
 * Where photos and videos are served from.
 *
 * `npm run media` records the bucket it uploaded to in src/data/media.json, so
 * the files and the address they live at travel together in git — pushing the
 * repo is enough to move the site to a different bucket, no hosting dashboard
 * required. NEXT_PUBLIC_MEDIA_BASE_URL still covers the case where nothing has
 * been uploaded yet, and /media is the local-dev fallback.
 */
export const MEDIA_BASE_URL =
  ("baseUrl" in manifest ? (manifest.baseUrl as string) : "") ||
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  "/media";

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
  { label: "Agencies", href: "/agencies" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
