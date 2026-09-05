/**
 * Listing packages and add-ons. Single source of truth — the Services page, the
 * home page preview and the booking funnel all read from here so prices can't
 * drift apart.
 *
 * `amount` is the number; `price` is derived from it at module load. Author the
 * amount and the string follows, so a price can never be edited in one place
 * and missed in the other. Every item also carries a stable `id`: display names
 * get rewritten, and a booking that stored "Signature" would lose its package
 * the day that happens.
 */

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

type Priced<T> = T & { price: string };

const priced = <T extends { amount: number }>(items: T[]): Priced<T>[] =>
  items.map((item) => ({ ...item, price: money(item.amount) }));

export { money };

type PackageInput = {
  id: string;
  name: string;
  /** Whole AUD. `price` is derived from this. */
  amount: number;
  products: string;
  turnaround: string;
  includes: string[];
  note: string;
  /** What this tier adds over the one below it, so the ladder reads at a glance. */
  step: string;
  /** Size of asset the fixed price covers. Commercial only: residential is
   *  per property, so scale never needed stating there. */
  scope?: string;
  /** Renders the price as "From $x". Commercial scope varies inside a tier. */
  priceFrom?: boolean;
  featured?: boolean;
};

export type ListingPackage = Priced<PackageInput>;

export const LISTING_PACKAGES: ListingPackage[] = priced<PackageInput>([
  {
    id: "pkg-listing",
    name: "Listing",
    amount: 349,
    products: "3 products included",
    turnaround: "Next business day",
    includes: [
      "15 professionally edited DSLR photos",
      "2D colour floor plan with your agency branding",
      "Landscape listing video",
      "Branded and unbranded exports, portal-ready",
    ],
    note: "Everything you need to get a listing live.",
    step: "The three things a listing can't go live without.",
  },
  {
    id: "pkg-signature",
    name: "Signature",
    amount: 499,
    products: "4 products included",
    turnaround: "Next business day",
    includes: [
      "18 professionally edited DSLR photos",
      "2D colour floor plan with your agency branding",
      "Landscape listing video",
      "Vertical agent-led video at the property. You on camera, branded to you, cut for Reels and TikTok",
      "Branded and unbranded exports, portal-ready",
    ],
    note: "The listing sells the property. The agent video sells you.",
    step: "Everything in Listing, plus a vertical video with you on camera. That video is why most agents pick this one.",
    featured: true,
  },
  {
    id: "pkg-premiere",
    name: "Premiere",
    amount: 899,
    products: "5 products included",
    turnaround: "Next business day",
    includes: [
      "25 professionally edited DSLR photos",
      "2D colour floor plan with your agency branding",
      "Filmed landscape property film, shot on camera rather than built from stills",
      "Vertical agent-led video",
      "Aerial photography and footage",
      "Branded and unbranded exports, portal-ready",
    ],
    note: "The full campaign, filmed properly.",
    step: "Everything in Signature, plus a filmed property film and aerial.",
  },
]);

/**
 * Commercial campaigns. Office and warehouse at a normal campaign scale is most
 * of the work, so those get a published price the way residential does; a full
 * project is quoted instead. Priced $50 over the residential equivalents, and
 * aerial is in the top tier because commercial sells on site context.
 */
export const COMMERCIAL_PACKAGES: ListingPackage[] = priced<PackageInput>([
  {
    id: "pkg-asset",
    name: "Asset",
    amount: 399,
    products: "3 products included",
    turnaround: "Next business day",
    includes: [
      "15 professionally edited DSLR photos",
      "2D floor plan with your agency branding",
      "Landscape property video",
      "Branded and unbranded exports, portal and IM ready",
    ],
    note: "Enough to take an asset to market.",
    step: "The three things a campaign can't launch without.",
    scope: "One office suite, floor or warehouse of standard size, shot in a single visit.",
    priceFrom: true,
  },
  {
    id: "pkg-campaign",
    name: "Campaign",
    amount: 549,
    products: "4 products included",
    turnaround: "Next business day",
    includes: [
      "18 professionally edited DSLR photos",
      "2D floor plan with your agency branding",
      "Landscape property video",
      "Vertical agent-led video at the asset, cut for LinkedIn",
      "Branded and unbranded exports, portal and IM ready",
    ],
    note: "The campaign sells the asset. The agent video sells you.",
    step: "Everything in Asset, plus a piece to camera from you.",
    scope: "One office suite, floor or warehouse of standard size, shot in a single visit.",
    priceFrom: true,
    featured: true,
  },
]);

/**
 * The third commercial tier, and a different buyer to the two above it. Not an
 * agency taking an asset to market: government, institutional and development
 * work that arrives as a requirement rather than a product list. Deliberately
 * not priced, because what is being bought is the expertise the brief calls
 * for, which no fixed number describes.
 */
export const COMMERCIAL_PROJECT = {
  id: "pkg-commercial-project",
  name: "Bespoke project",
  price: "Quoted per project",
  note: "Not agency work. Projects briefed on requirements, not packages.",
  pitch:
    "Government, institutional and development projects don't arrive as fifteen photos and a floor plan. They arrive as a requirement. We scope the filming and photography to meet it, and price on the expertise the brief calls for and the skills we combine to deliver it.",
  includes: [
    "Government, institutional and development projects",
    "Bespoke filming and photography, scoped to the brief",
    "Requirements our packaged work isn't built for",
    "Priced on expertise, not on a count of products",
  ],
};

/** Cheapest published commercial package, quoted in summary lines. */
export const COMMERCIAL_FROM = money(
  Math.min(...COMMERCIAL_PACKAGES.map((p) => p.amount))
);

/**
 * Agent monthly content, sold to the individual agent rather than the agency.
 * None of the four videos is about a property, which is the whole line between
 * this and the agent video inside a Signature listing. Copy anywhere this is
 * sold has to hold that line or the two read as the same thing twice.
 */
export const AGENT_CONTENT = {
  id: "ret-agent-content",
  name: "Everything But The House",
  amount: 800,
  price: money(800),
  priceSub: "from, per month",
  headline: "Four videos about you. No listing required.",
  pitch:
    "Listing content only exists while you have stock. This doesn't. Four pieces to camera about who you are, how you work and what you know about your area, planned and posted for you.",
  includes: [
    "Four agent-led videos a month, none of them about a property",
    "A content plan for the month, so the four have a point",
    "We film, edit, caption and post them for you",
    "You turn up for an hour and a half",
  ],
  /** Answers "isn't this the Signature agent video again?" wherever it's sold. */
  vsListing:
    "Signature puts you on camera at the property. This puts you on camera when you haven't got one.",
};

/**
 * Agency monthly management. Lived in the Agencies page markup until the
 * booking funnel needed to sell it, which meant the same $1,800 was written out
 * in five files.
 */
export const AGENCY_MANAGEMENT = {
  id: "ret-agency-management",
  name: "Monthly Social Media Management",
  amount: 1800,
  price: money(1800),
  priceSub: "from, per month",
  headline: "Your agency's whole social presence, run for you.",
  pitch:
    "We plan the month, film it in one batch, edit it, write the captions and post it. One team, start to finish.",
  includes: [
    "8 social media videos per month",
    "6 social media posts per month",
    "6 stories per month",
    "Monthly planning, direction & content coordination",
    "Editing, captions & scheduling",
  ],
};

type AddOnInput = {
  id: string;
  name: string;
  amount: number;
  /** Shown under the name when there's a condition worth stating up front. */
  detail?: string;
};

export type AddOn = Priced<AddOnInput>;

export const ADD_ONS: AddOn[] = priced<AddOnInput>([
  { id: "add-twilight", name: "Twilight & dusk images", amount: 40 },
  { id: "add-3d-tour", name: "3D virtual tour", amount: 179 },
  { id: "add-aerial-photo", name: "Aerial photography", amount: 150 },
  { id: "add-aerial-video", name: "Aerial video", amount: 150 },
  {
    id: "add-aerial-pack",
    name: "Aerial pack",
    amount: 200,
    detail:
      "Aerial photography and aerial video. Individually $300. Included in the Premiere package",
  },
  {
    id: "add-virtual-staging",
    name: "Virtual staging, 5 rooms",
    amount: 200,
    detail: "Staged photos appear in your listing video at no extra cost",
  },
  {
    id: "add-listing-video",
    name: "Listing video",
    amount: 200,
    detail: "Listing video built from your photos",
  },
  {
    id: "add-vacant-pack",
    name: "Vacant property pack",
    amount: 349,
    detail: "5 staged rooms and a listing video. Individually $400",
  },
  { id: "add-open-home-video", name: "Open home video", amount: 129 },
  { id: "add-extra-images", name: "Extra images", amount: 49, detail: "per 5" },
]);

const byId = (id: string): AddOn => {
  const found = ADD_ONS.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown add-on: ${id}`);
  return found;
};

/**
 * Add-ons offered against a commercial campaign. Picked from ADD_ONS rather
 * than restated: the five that carry across are the same price, and twilight,
 * room staging and open homes have no meaning on an industrial estate. Aerial
 * carries a commercial tier note rather than the residential one.
 */
export const COMMERCIAL_ADD_ONS: AddOn[] = [
  byId("add-3d-tour"),
  byId("add-aerial-photo"),
  byId("add-aerial-video"),
  {
    ...byId("add-aerial-pack"),
    detail: "Aerial photography and aerial video. Individually $300",
  },
  byId("add-extra-images"),
];

/**
 * Vacant property. Sold alongside a listing package rather than instead of
 * one, so it has its own section on Services and is offered again next to
 * the packages. The ids match the add-ons deliberately — these are the same
 * three products in a different placement, not extra ones.
 */
export const VACANT_PROPERTY = {
  heading: "Already have photos?",
  intro:
    "For offices and property managers with vacant stock. Send us your photos and we will stage the rooms that need it and build the video.",
  options: priced([
    {
      id: "add-virtual-staging",
      name: "Virtual staging",
      amount: 200,
      includes: ["5 virtually staged rooms"],
    },
    {
      id: "add-listing-video",
      name: "Listing video",
      amount: 200,
      includes: ["Built from your photos"],
    },
    {
      id: "add-vacant-pack",
      name: "Vacant property pack",
      amount: 349,
      includes: ["5 virtually staged rooms", "Listing video built from your photos"],
      note: "Individually $400",
      featured: true,
    },
  ] as {
    id: string;
    name: string;
    amount: number;
    includes: string[];
    note?: string;
    featured?: boolean;
  }[]),
  smallPrint: "All virtually staged images and video are labelled as virtually staged.",
};

/** Cheapest add-on, quoted on the package cards. */
export const ADD_ONS_FROM = money(Math.min(...ADD_ONS.map((a) => a.amount)));

/** Price span across the packages, for summary lines. */
export const LISTING_PRICE_RANGE = `${money(
  Math.min(...LISTING_PACKAGES.map((p) => p.amount))
)} to ${money(Math.max(...LISTING_PACKAGES.map((p) => p.amount)))}`;
