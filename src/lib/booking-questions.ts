/**
 * The second half of the funnel: what we ask *after* the lead is already safe.
 *
 * None of it is required. The lead was captured and emailed the moment they
 * gave us a name and a number, so everything here is upside — it turns a lead
 * into a booking we can actually schedule, and a couple of the answers are the
 * best upsell moment in the whole flow. Someone who has just told us the
 * property is empty isn't being pitched staging, they're being answered.
 *
 * Labels live here rather than in the form so the email can render the same
 * question text the customer saw.
 */

import type { Stream } from "./catalogue";

export type Question = {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "choice";
  options?: string[];
  placeholder?: string;
  hint?: string;
  /** Answering this way makes an add-on worth offering, right there. */
  triggers?: { when: string[]; addOnId: string; line: string };
};

export const DETAIL_QUESTIONS: Record<Stream, Question[]> = {
  residential: [
    {
      id: "address",
      label: "Property address",
      type: "text",
      placeholder: "12 Smith Street, Brighton VIC 3186",
    },
    {
      id: "live_date",
      label: "When does it need to be live?",
      type: "date",
      hint: "Shot one day, delivered the next business day.",
    },
    {
      id: "access",
      label: "Who lets us in?",
      type: "choice",
      options: ["Agent on site", "Tenant", "Lockbox or key safe", "Vendor will be home", "Not sure yet"],
    },
    {
      id: "occupancy",
      label: "Is it occupied, vacant or tenanted?",
      type: "choice",
      options: ["Occupied", "Vacant", "Tenanted"],
      triggers: {
        when: ["Vacant"],
        addOnId: "add-virtual-staging",
        line: "Empty rooms photograph cold and sell slower. Five virtually staged rooms is $200, and the staged frames go into your listing video at no extra cost.",
      },
    },
    {
      id: "property_type",
      label: "What are we shooting?",
      type: "choice",
      options: ["Apartment or unit", "House, 1–3 bed", "House, 4+ bed", "Acreage or estate"],
      triggers: {
        when: ["House, 4+ bed", "Acreage or estate"],
        addOnId: "add-extra-images",
        line: "A home that size usually runs past the photo count in the package. Extra images are $49 per 5.",
      },
    },
    {
      id: "notes",
      label: "Anything we should know?",
      type: "textarea",
      placeholder: "Parking, pets, styling arriving Tuesday, a room that has to be shot first…",
    },
  ],

  commercial: [
    {
      id: "address",
      label: "Asset address",
      type: "text",
      placeholder: "45 Fitzgerald Road, Laverton North VIC",
    },
    {
      id: "close_date",
      label: "EOI or auction close",
      type: "date",
      hint: "Tell us the close date and we schedule backwards from it.",
    },
    {
      id: "asset_class",
      label: "What kind of asset?",
      type: "choice",
      options: ["Office", "Industrial", "Retail", "Development site", "Land", "Mixed use"],
    },
    {
      id: "tenancy",
      label: "Is the asset trading?",
      type: "choice",
      options: ["Vacant possession", "Tenanted and trading", "Part tenanted", "Not sure"],
      hint: "We schedule to trading hours and access, not to our own convenience.",
    },
    {
      id: "size",
      label: "Roughly how big?",
      type: "text",
      placeholder: "1,200 sqm · 3 floorplates · 2 buildings",
      hint: "If it's bigger than a package we'll quote it against the asset instead.",
    },
    {
      id: "nda",
      label: "Do we need to sign an NDA?",
      type: "choice",
      options: ["Yes — we'll send ours", "No", "Not sure yet"],
      hint: "Off-market stays off-market. We sign before anything is shot.",
    },
    {
      id: "notes",
      label: "Anything we should know?",
      type: "textarea",
      placeholder: "Site inductions, tenant hours, gate access, what's already been shot…",
    },
  ],

  monthly: [
    { id: "agency", label: "Agency name", type: "text", placeholder: "Your agency" },
    {
      id: "team_size",
      label: "How many agents would be on camera?",
      type: "choice",
      options: ["Just me", "2–5", "6–15", "16 or more"],
    },
    {
      id: "volume",
      label: "How many listings a month?",
      type: "choice",
      options: ["1–2", "3–5", "6–10", "10 or more"],
    },
    {
      id: "start",
      label: "When do you want to start?",
      type: "choice",
      options: ["As soon as you can", "Next month", "In a couple of months", "Just pricing it up"],
    },
    {
      id: "channels",
      label: "Where do you post now?",
      type: "text",
      placeholder: "@youragency · LinkedIn · TikTok",
    },
    {
      id: "notes",
      label: "What isn't working right now?",
      type: "textarea",
      placeholder: "Posting stops when it gets busy, nobody edits, the feed looks nothing like the brand…",
    },
  ],
};

/** How far through the optional half they are, for the progress meter. */
export const answeredCount = (
  stream: Stream,
  answers: Record<string, string>
): { answered: number; total: number } => {
  const questions = DETAIL_QUESTIONS[stream];
  return {
    answered: questions.filter((q) => (answers[q.id] ?? "").trim()).length,
    total: questions.length,
  };
};

export const questionsFor = (stream: Stream): Question[] => DETAIL_QUESTIONS[stream];

export const labelFor = (stream: Stream, id: string): string =>
  DETAIL_QUESTIONS[stream].find((q) => q.id === id)?.label ?? id;
