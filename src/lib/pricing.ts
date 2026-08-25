/**
 * Listing packages and add-ons. Single source of truth — the Services page and
 * the home page preview both read from here so prices can't drift apart.
 */

export type ListingPackage = {
  name: string;
  price: string;
  products: string;
  turnaround: string;
  includes: string[];
  note: string;
  /** What this tier adds over the one below it, so the ladder reads at a glance. */
  step: string;
  featured?: boolean;
};

export const LISTING_PACKAGES: ListingPackage[] = [
  {
    name: "Listing",
    price: "$349",
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
    name: "Signature",
    price: "$499",
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
    name: "Premiere",
    price: "$899",
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
];

/**
 * Commercial campaigns. Office and warehouse at a normal campaign scale is most
 * of the work, so those get a published price the way residential does; a full
 * project is quoted instead. Priced $50 over the residential equivalents, and
 * aerial is in the top tier because commercial sells on site context.
 */
export const COMMERCIAL_PACKAGES: ListingPackage[] = [
  {
    name: "Asset",
    price: "$399",
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
  },
  {
    name: "Campaign",
    price: "$549",
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
    featured: true,
  },
];

/** Cheapest published commercial package, quoted in summary lines. */
export const COMMERCIAL_FROM = "$399";


/**
 * Agent monthly content, sold to the individual agent rather than the agency.
 * None of the four videos is about a property, which is the whole line between
 * this and the agent video inside a Signature listing. Copy anywhere this is
 * sold has to hold that line or the two read as the same thing twice.
 */
export const AGENT_CONTENT = {
  name: "Everything But The House",
  price: "$800",
  priceSub: "per month",
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

export type AddOn = {
  name: string;
  price: string;
  /** Shown under the name when there's a condition worth stating up front. */
  detail?: string;
};


/**
 * Add-ons offered against a commercial campaign. Listed out rather than
 * filtered from ADD_ONS: that list is residential and grows, and twilight,
 * room staging and open homes have no meaning on an industrial estate. Aerial
 * carries a commercial tier note rather than the residential one.
 */
export const COMMERCIAL_ADD_ONS: AddOn[] = [
  { name: "3D virtual tour", price: "$179" },
  { name: "Aerial photography", price: "$150" },
  { name: "Aerial video", price: "$150" },
  { name: "Aerial pack", price: "$200", detail: "Aerial photography and aerial video. Individually $300" },
  { name: "Extra images", price: "$49", detail: "per 5" },
];
export const ADD_ONS: AddOn[] = [
  { name: "Twilight & dusk images", price: "$40" },
  { name: "3D virtual tour", price: "$179" },
  { name: "Aerial photography", price: "$150" },
  { name: "Aerial video", price: "$150" },
  {
    name: "Aerial pack",
    price: "$200",
    detail: "Aerial photography and aerial video. Individually $300. Included in the Premiere package",
  },
  {
    name: "Virtual staging, 5 rooms",
    price: "$200",
    detail: "Staged photos appear in your listing video at no extra cost",
  },
  { name: "Listing video", price: "$200", detail: "Listing video built from your photos" },
  { name: "Vacant property pack", price: "$349", detail: "5 staged rooms and a listing video. Individually $400" },
  { name: "Open home video", price: "$129" },
  { name: "Extra images", price: "$49", detail: "per 5" },
];

/**
 * Vacant property. Sold alongside a listing package rather than instead of
 * one, so it has its own section on Services and is offered again next to
 * the packages.
 */
export const VACANT_PROPERTY = {
  heading: "Already have photos?",
  intro:
    "For offices and property managers with vacant stock. Send us your photos and we will stage the rooms that need it and build the video.",
  options: [
    {
      name: "Virtual staging",
      price: "$200",
      includes: ["5 virtually staged rooms"],
    },
    {
      name: "Listing video",
      price: "$200",
      includes: ["Built from your photos"],
    },
    {
      name: "Vacant property pack",
      price: "$349",
      includes: ["5 virtually staged rooms", "Listing video built from your photos"],
      note: "Individually $400",
      featured: true,
    },
  ],
  smallPrint: "All virtually staged images and video are labelled as virtually staged.",
};

/** Cheapest add-on, quoted on the package cards. */
export const ADD_ONS_FROM = "$40";

/** Price span across the packages, for summary lines. */
export const LISTING_PRICE_RANGE = "$349 to $899";
