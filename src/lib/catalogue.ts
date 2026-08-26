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
    label: "A residential listing",
    blurb: "Photos, floor plan and video for a house or apartment going to market.",
  },
  {
    id: "commercial",
    label: "A commercial asset",
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
    stepUpTo: "pkg-signature",
    stepUpPitch:
      "The same shoot, plus a vertical video with you on camera. The listing sells the property — that video sells you. Most agents take it.",
  }),
  // No stepUpTo. The step-up card is only ever offered towards the tier marked
  // most popular — Signature here, Campaign on commercial. Pushing someone from
  // the tier they came for up to the top of the ladder reads as a squeeze, and
  // Premiere is chosen by people who already knew they wanted it.
  fromPackage(pkg("pkg-signature"), { stream: "residential" }),
  fromPackage(pkg("pkg-premiere"), {
    stream: "residential",
    contains: [VIDEO, ...AERIAL],
  }),
  fromPackage(pkg("pkg-asset"), {
    stream: "commercial",
    stepUpTo: "pkg-campaign",
    stepUpPitch:
      "Your buyers are on LinkedIn, and nobody picks an agent off a hero shot of a warehouse. Adds a piece to camera from you while we're already on site.",
  }),
  fromPackage(pkg("pkg-campaign"), { stream: "commercial" }),
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

export type BookableAddOn = AddOn & {
  streams: Stream[];
  /** Sold per unit of `step` items rather than once. */
  quantity?: { step: number; unit: string; max: number };
  /** This item is the two-or-more items it lists, cheaper. */
  bundleOf?: string[];
  /** Only meaningful when there's no shoot — never offered against a package. */
  noShootOnly?: boolean;
  /** Sold as a small tile rather than a card with an argument. */
  compact?: boolean;
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
 * `compact` splits the list in two. Four of them carry an argument and get a
 * card with room for it; the rest are things people either want or don't, and
 * a paragraph explaining aerial stills to someone who just saw the pack is
 * eight rows of scrolling on a phone for nothing.
 */
export const BOOKABLE_ADD_ONS: BookableAddOn[] = [
  {
    ...addOn("add-aerial-pack"),
    streams: BOTH,
    bundleOf: ["add-aerial-photo", "add-aerial-video"],
    pitch: "Where the property sits, what it backs onto, how the block reads. Both formats.",
  },
  {
    ...addOn("add-twilight"),
    streams: RES,
    pitch: "The shot that stops the scroll at 9pm. Cheapest yes on this page.",
  },
  {
    ...addOn("add-3d-tour"),
    streams: BOTH,
    pitch: "Buyers walk it before they turn up, so the ones who do turn up are serious.",
  },
  {
    ...addOn("add-virtual-staging"),
    streams: RES,
    pitch: "Empty rooms photograph cold. The staged frames ride into your video for free.",
  },
  {
    ...addOn("add-open-home-video"),
    compact: true,
    streams: RES,
    pitch: "Turns one Saturday into a week of content and proof of the crowd.",
  },
  {
    ...addOn("add-extra-images"),
    compact: true,
    streams: BOTH,
    quantity: { step: 5, unit: "images", max: 6 },
    pitch: "Bigger homes need more frames than the package carries. Five at a time.",
  },
  {
    ...addOn("add-aerial-photo"),
    compact: true,
    streams: BOTH,
    pitch: "Stills only. The pack above is $100 cheaper than taking this and the video.",
  },
  {
    ...addOn("add-aerial-video"),
    compact: true,
    streams: BOTH,
    pitch: "Footage only. The pack above is $100 cheaper than taking this and the stills.",
  },
  {
    ...addOn("add-listing-video"),
    compact: true,
    streams: RES,
    noShootOnly: true,
    pitch: "Built from photos you already have.",
  },
  {
    ...addOn("add-vacant-pack"),
    compact: true,
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
