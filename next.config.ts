import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

/**
 * Photos served from the media bucket still go through next/image, so its host
 * has to be allow-listed. The bucket the last `npm run media` uploaded to is
 * recorded in the manifest; env covers the case where nothing is uploaded yet.
 */
const mediaHost = (() => {
  let manifestBase = "";
  try {
    manifestBase = JSON.parse(readFileSync("./src/data/media.json", "utf8")).baseUrl ?? "";
  } catch {
    /* no manifest yet */
  }

  const url = manifestBase || process.env.NEXT_PUBLIC_MEDIA_BASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Packages folded into Services — keep old links and search results working.
  async redirects() {
    return [{ source: "/packages", destination: "/services", permanent: true }];
  },
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
