import type { Metadata } from "next";
import { SITE } from "./site";

/**
 * Per-page metadata, including the link preview.
 *
 * Next does not build a page's Open Graph block from its `title` and
 * `description`. A page that sets only those inherits the whole openGraph
 * object from the root layout, which is why every link to this site used to
 * preview as the same picture under the same sentence: paste three of them
 * into one conversation and you appear to have sent the same thing three
 * times. This builds both halves from one set of inputs, so a page cannot be
 * given a title and silently keep somebody else's preview.
 *
 * `share` is the line a messaging app prints in bold under the image. It is
 * applied as an absolute title so the root layout's "| SCRM Media Real Estate"
 * suffix stays out of it — useful in a browser tab, wasted space in a chat
 * bubble that has the domain printed underneath it anyway.
 *
 * `card` names a file in public/og, built by scripts/og-images.mjs.
 */
export function pageMeta({
  title,
  share,
  description,
  path,
  card,
  cardAlt,
  robots,
}: {
  /** Browser tab and search result. Gets the site-name suffix. */
  title: string;
  /** Link preview headline. Defaults to `title`. Keep it short. */
  share?: string;
  description: string;
  /** Route, leading slash, no domain. Canonical and og:url. */
  path: string;
  /** Basename in public/og, without the extension. */
  card: string;
  /** What the card shows, for anyone reading with a screen reader. */
  cardAlt: string;
  robots?: Metadata["robots"];
}): Metadata {
  const image = `/og/${card}.jpg`;
  const headline = { absolute: share ?? title };

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(robots ? { robots } : {}),
    openGraph: {
      type: "website",
      locale: "en_AU",
      siteName: SITE.name,
      url: path,
      title: headline,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: cardAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: [image],
    },
  };
}
