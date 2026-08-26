/**
 * The booking catalogue: everything sellable, plus the relationships between
 * the items that a cart has to know about.
 *
 * `pricing.ts` holds what things cost and how they're described. This holds
 * what can be sold with what — which add-ons a package already contains, which
 * bundles are made of which parts, and which tier sits above which. Those rules
 * used to live in sentences of marketing copy ("Included in the Premiere
 * package"), which reads fine on a card and is unusable in a total.
 */

import {
  ADD_ONS,
  AGENCY_MANAGEMENT,
  AGENT_CONTENT,
  COMMERCIAL_PACKAGES,
  LISTING_PACKAGES,
  money,
  type AddOn,
} from "./pricing";

export type Stream = "residential" | "commercial" | "monthly";

export const STREAMS: { id: Stream; label: string; blurb: string }[] = [
  {
    id: "residential",
    label: "Residential listing",
    blurb: "Photos, floor plan and video for a house or apartment going to market.",
  },
  {
    id: "commercial",
    label: "Commercial asset",
    blurb: "Office, industrial, retail, development site or land, scheduled to your close date.",
  },
  {
    id: "monthly",
    label: "Monthly content",
    blurb: "Ongoing video and social for you as an agent, or for the whole agency.",
  },
];

/**
 * A package, a retainer or a quote — one shape, because the funnel treats them
 * the same until the step where it asks about the property.
 */
export type BookableOffer = {
  id: string;
  name: string;
  stream: Stream;
  /** Whole AUD. 0 when the offer is quoted rather than priced. */
  amount: number;
  price: string;
  priceSub?: string;
  /** Quoted, not priced — skips the upsell step. */
  quote?: boolean;
  /** Billed monthly, so no shoot date and no add-ons. */
  recurring?: boolean;
  products?: string;
  turnaround?: string;
  includes: string[];
  note?: string;
  step?: string;
  featured?: boolean;
  /** Add-on ids this offer already contains. The suppression list. */
  contains: string[];
  /** The tier above, for the step-up card. */
  stepUpTo?: string;
  /** Why the step up is worth it. Written to be read by someone deciding. */
  stepUpPitch?: string;
  /** One line under the name. What this package is for. */
  tagline?: string;
  /** Short scannable inclusions. Only the bottom tier of a ladder lists its own. */
  highlights?: string[];
  /** The tier this one builds on, so the card can say "everything in X, plus". */
  buildsOn?: string;
  /** What it adds on top of `buildsOn`. The only thing anyone needs to compare. */
  plus?: string[];
};

/** Every package includes a listing or property video of some kind. */
const VIDEO = "add-listing-video";
const AERIAL = ["add-aerial-pack", "add-aerial-photo", "add-aerial-video"];

const fromPackage = (
  pkg: (typeof LISTING_PACKAGES)[number],
  extra: Partial<BookableOffer> & { stream: Stream }
): BookableOffer => ({
  id: pkg.id,
  name: pkg.name,
  amount: pkg.amount,
  price: pkg.price,
  products: pkg.products,
  turnaround: pkg.turnaround,
  includes: pkg.includes,
  note: pkg.note,
  step: pkg.step,
  featured: pkg.featured,
  contains: [VIDEO],
  ...extra,
});

const pkg = (id: string) => {
  const found = [...LISTING_PACKAGES, ...COMMERCIAL_PACKAGES].find((p) => p.id === id);
  if (!found) throw new Error(`Unknown package: ${id}`);
  return found;
};

export const OFFERS: BookableOffer[] = [
  fromPackage(pkg("pkg-listing"), {
    stream: "residential",
    tagline: "Everything needed to launch the property.",
    highlights: ["15 photos", "Branded floor plan", "Listing video"],
    stepUpTo: "pkg-signature",
    stepUpPitch:
      "The same shoot, plus a vertical video with you on camera. The listing sells the property — that video sells you. Most agents take it.",
  }),
  // No stepUpTo. The step-up card is only ever offered towards the tier marked
  // most popular — Signature here, Campaign on commercial. Pushing someone from
  // the tier they came for up to the top of the ladder reads as a squeeze, and
  // Premiere is chosen by people who already knew they wanted it.
  fromPackage(pkg("pkg-signature"), {
    stream: "residential",
    tagline: "The listing sells the property. The video sells you.",
    buildsOn: "pkg-listing",
    plus: ["Agent vertical video, cut for Reels and TikTok", "18 photos instead of 15"],
  }),
  fromPackage(pkg("pkg-premiere"), {
    stream: "residential",
    tagline: "The full campaign, filmed properly.",
    buildsOn: "pkg-signature",
    plus: [
      "Cinematic property film, shot on camera rather than built from stills",
      "Drone photo and video",
      "25 photos instead of 18",
    ],
    contains: [VIDEO, ...AERIAL],
  }),
  fromPackage(pkg("pkg-asset"), {
    stream: "commercial",
    tagline: "Enough to take an asset to market.",
    highlights: ["15 photos", "Branded floor plan", "Property video"],
    stepUpTo: "pkg-campaign",
    stepUpPitch:
      "Your buyers are on LinkedIn, and nobody picks an agent off a hero shot of a warehouse. Adds a piece to camera from you while we're already on site.",
  }),
  fromPackage(pkg("pkg-campaign"), {
    stream: "commercial",
    tagline: "The campaign sells the asset. The video sells you.",
    buildsOn: "pkg-asset",
    plus: ["Agent vertical video, cut for LinkedIn", "18 photos instead of 15"],
  }),
  {
    id: "pkg-commercial-project",
    name: "Bigger than a package",
    stream: "commercial",
    amount: 0,
    price: "Quoted",
    quote: true,
    includes: [
      "Multi-building projects and floorplate portfolios",
      "Campaigns that run in rounds over six weeks",
      "More than one shooter or more than one day on site",
      "Public liability insured, and we sign your NDA",
    ],
    note: "Send the address and the close date. That's enough to quote it.",
    contains: [],
  },
  {
    id: AGENT_CONTENT.id,
    name: AGENT_CONTENT.name,
    stream: "monthly",
    amount: AGENT_CONTENT.amount,
    price: AGENT_CONTENT.price,
    priceSub: AGENT_CONTENT.priceSub,
    recurring: true,
    includes: AGENT_CONTENT.includes,
    note: AGENT_CONTENT.headline,
    step: AGENT_CONTENT.vsListing,
    featured: true,
    contains: [],
  },
  {
    id: AGENCY_MANAGEMENT.id,
    name: AGENCY_MANAGEMENT.name,
    stream: "monthly",
    amount: AGENCY_MANAGEMENT.amount,
    price: AGENCY_MANAGEMENT.price,
    priceSub: AGENCY_MANAGEMENT.priceSub,
    recurring: true,
    includes: AGENCY_MANAGEMENT.includes,
    note: AGENCY_MANAGEMENT.headline,
    contains: [],
  },
  {
    id: "ret-tailored",
    name: "Something bigger",
    stream: "monthly",
    amount: 0,
    price: "Quoted",
    quote: true,
    recurring: true,
    includes: [
      "Higher content velocity across more agents",
      "Paid distribution behind the creative that's working",
      "Listing media rolled into the monthly",
    ],
    note: "Scoped against your listing volume and what you want to hit in 90 days.",
    contains: [],
  },
];

export type AddOnGroup = "presentation" | "aerial" | "content";

export const ADD_ON_GROUPS: { id: AddOnGroup; label: string }[] = [
  { id: "presentation", label: "Property presentation" },
  { id: "aerial", label: "Aerial" },
  { id: "content", label: "Extra content" },
];

export type BookableAddOn = AddOn & {
  streams: Stream[];
  /** Sold per unit of `step` items rather than once. */
  quantity?: { step: number; unit: string; max: number };
  /** This item is the two-or-more items it lists, cheaper. */
  bundleOf?: string[];
  /** Only meaningful when there's no shoot — never offered against a package. */
  noShootOnly?: boolean;
  /** Which shelf it sits on. Three short lists beat one list of ten. */
  group: AddOnGroup;
  /** One line of why, shown on the upsell step. */
  pitch?: string;
};

const addOn = (id: string): AddOn => {
  const found = ADD_ONS.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown add-on: ${id}`);
  return found;
};

const BOTH: Stream[] = ["residential", "commercial"];
const RES: Stream[] = ["residential"];

/**
 * Ordered the way they're offered, not by price: the aerial pack leads because
 * it's the one most campaigns should take and the saving is the clearest, the
 * cheap yeses sit under it, and the two aerial singles go last so nobody buys
 * them separately without having seen the pack first.
 *
 * `group` puts them on three short shelves rather than one list of ten. Nobody
 * studies ten options; everybody scans three headings and stops at the one that
 * matches what the property needs.
 */
export const BOOKABLE_ADD_ONS: BookableAddOn[] = [
  {
    ...addOn("add-aerial-pack"),
    group: "aerial",
    streams: BOTH,
    bundleOf: ["add-aerial-photo", "add-aerial-video"],
    pitch: "Where the property sits, what it backs onto, how the block reads. Both formats.",
  },
  {
    ...addOn("add-twilight"),
    group: "presentation",
    streams: RES,
    pitch: "The shot that stops the scroll at 9pm. Cheapest yes on this page.",
  },
  {
    ...addOn("add-3d-tour"),
    group: "presentation",
    streams: BOTH,
    pitch: "Buyers walk it before they turn up, so the ones who do turn up are serious.",
  },
  {
    ...addOn("add-virtual-staging"),
    group: "presentation",
    streams: RES,
    pitch: "Empty rooms photograph cold. The staged frames ride into your video for free.",
  },
  {
    ...addOn("add-open-home-video"),
    group: "content",
    streams: RES,
    pitch: "Turns one Saturday into a week of content and proof of the crowd.",
  },
  {
    ...addOn("add-extra-images"),
    group: "content",
    streams: BOTH,
    quantity: { step: 5, unit: "images", max: 6 },
    pitch: "Bigger homes need more frames than the package carries. Five at a time.",
  },
  {
    ...addOn("add-aerial-photo"),
    group: "aerial",
    streams: BOTH,
    pitch: "Stills only. The pack above is $100 cheaper than taking this and the video.",
  },
  {
    ...addOn("add-aerial-video"),
    group: "aerial",
    streams: BOTH,
    pitch: "Footage only. The pack above is $100 cheaper than taking this and the stills.",
  },
  {
    ...addOn("add-listing-video"),
    group: "content",
    streams: RES,
    noShootOnly: true,
    pitch: "Built from photos you already have.",
  },
  {
    ...addOn("add-vacant-pack"),
    group: "presentation",
    streams: RES,
    noShootOnly: true,
    bundleOf: ["add-virtual-staging", "add-listing-video"],
    pitch: "Staged rooms and a video, from photos you already have.",
  },
];

export const getOffer = (id: string | null | undefined): BookableOffer | undefined =>
  OFFERS.find((o) => o.id === id);

export const getAddOn = (id: string): BookableAddOn | undefined =>
  BOOKABLE_ADD_ONS.find((a) => a.id === id);

export const offersForStream = (stream: Stream): BookableOffer[] =>
  OFFERS.filter((o) => o.stream === stream);

export { money };
