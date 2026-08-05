import type { NextConfig } from "next";

/**
 * Photos served from Supabase Storage still go through next/image, so the
 * bucket host has to be allow-listed. Derived from the env you already set.
 */
const mediaHost = (() => {
  const url = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      ...(mediaHost && !mediaHost.endsWith(".supabase.co")
        ? [{ protocol: "https" as const, hostname: mediaHost }]
        : []),
    ],
  },
};

export default nextConfig;
