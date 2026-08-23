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
      "Vertical agent-led video — you on camera, branded to you, cut for Reels and TikTok",
      "Branded and unbranded exports, portal-ready",
    ],
    note: "The listing sells the property. The agent video sells you.",
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
      "Filmed landscape property film — shot on camera, not built from stills",
      "Vertical agent-led video",
      "Aerial photography and footage",
      "Branded and unbranded exports, portal-ready",
    ],
    note: "The full campaign, filmed properly.",
  },
];

export type AddOn = {
  name: string;
  price: string;
  /** Shown under the name when there's a condition worth stating up front. */
  detail?: string;
};

export const ADD_ONS: AddOn[] = [
  { name: "Twilight & dusk images", price: "$40" },
  { name: "3D virtual tour", price: "$179" },
  { name: "Aerial photography", price: "$149", detail: "Listing & Signature — included in Premiere" },
  { name: "Virtual staging", price: "$45", detail: "per image" },
  { name: "Open home video", price: "$129" },
  { name: "Express floor plan", price: "$40", detail: "6 hours" },
  { name: "Extra images", price: "$49", detail: "per 5" },
];

/** Cheapest add-on, quoted on the package cards. */
export const ADD_ONS_FROM = "$40";

/** Price span across the packages, for summary lines. */
export const LISTING_PRICE_RANGE = "$349 – $899";
