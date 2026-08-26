/**
 * The rules the catalogue implies, as plain functions.
 *
 * No React in here on purpose: the browser uses these to draw a running total,
 * and the API route uses the same code to recompute that total from ids before
 * it emails anyone a number. A price the client sent is never trusted.
 */

import {
  ADD_ON_GROUPS,
  BOOKABLE_ADD_ONS,
  OFFERS,
  getAddOn,
  getOffer,
  money,
  type AddOnGroup,
  type BookableAddOn,
  type BookableOffer,
} from "./catalogue";

export type AddOnRow = {
  addOn: BookableAddOn;
  /** Already inside the chosen package, so it can be shown but not sold again. */
  included: boolean;
  includedReason?: string;
};

/**
 * The add-ons offered against one package.
 *
 * Anything the package already contains comes back flagged rather than dropped:
 * "already in Premiere" struck through is the clearest argument for why Premiere
 * costs what it does. Included rows sort last so the sellable ones lead.
 */
export function availableAddOns(offerId: string | undefined): AddOnRow[] {
  const offer = getOffer(offerId);
  if (!offer || offer.quote || offer.recurring) return [];

  const rows: AddOnRow[] = [];

  for (const addOn of BOOKABLE_ADD_ONS) {
    if (!addOn.streams.includes(offer.stream)) continue;

    if (offer.contains.includes(addOn.id)) {
      rows.push({
        addOn,
        included: true,
        includedReason: `Already in ${offer.name}`,
      });
      continue;
    }

    // No-shoot products have nothing to attach to when someone is booking a
    // shoot — the package already covers what they do.
    if (addOn.noShootOnly) continue;

    rows.push({ addOn, included: false });
  }

  return [...rows.filter((r) => !r.included), ...rows.filter((r) => r.included)];
}

/** The add-ons for one package, split onto their three shelves. */
export function groupedAddOns(
  offerId: string | undefined
): { id: AddOnGroup; label: string; rows: AddOnRow[] }[] {
  const rows = availableAddOns(offerId);
  return ADD_ON_GROUPS.map((group) => ({
    ...group,
    rows: rows.filter((r) => r.addOn.group === group.id),
  })).filter((g) => g.rows.length > 0);
}

export type Upgrade = {
  to: BookableOffer;
  /** What moving up actually costs, given what they've already added. */
  delta: number;
  /** The headline gap between the two package prices. */
  rawGap: number;
  /** Selected add-ons the upgrade absorbs, so they stop being charged. */
  covered: BookableAddOn[];
  /** What else the higher tier brings. */
  plus: string[];
};

/**
 * The upgrade worth offering, priced against what's actually in the cart.
 *
 * Signature is $499 and Premiere is $899, so the headline gap is $400 — but
 * someone who has already added the $200 aerial pack is $200 away, not $400,
 * because Premiere contains it. Quoting the headline number to that person is
 * both wrong and a worse offer than the truth.
 *
 * Only two things earn a banner: the step towards the tier marked most popular,
 * and any higher tier that costs less than its sticker gap because it absorbs
 * something already selected. A naked "+$400" for nothing extra is neither.
 */
export function upgradeOffer(
  offerId: string | undefined,
  selected: string[] = [],
  quantities: Record<string, number> = {}
): Upgrade | undefined {
  const from = getOffer(offerId);
  if (!from || from.quote || from.recurring) return undefined;

  const current = quote(from.id, selected, quantities).total;

  const candidates = OFFERS.filter(
    (o) => o.stream === from.stream && !o.quote && !o.recurring && o.amount > from.amount
  )
    .map((to) => {
      const delta = quote(to.id, selected, quantities).total - current;
      const rawGap = to.amount - from.amount;
      const covered = quote(from.id, selected, quantities)
        .lines.filter((l) => to.contains.includes(l.id))
        .map((l) => getAddOn(l.id))
        .filter((a): a is BookableAddOn => Boolean(a));
      return { to, delta, rawGap, covered, plus: to.plus ?? [] };
    })
    .filter((c) => c.to.id === from.stepUpTo || c.delta < c.rawGap);

  if (!candidates.length) return undefined;
  return candidates.sort((a, b) => a.delta - b.delta)[0];
}

export type Collapse = {
  bundleId: string;
  bundleName: string;
  partIds: string[];
  saved: number;
};

export type Resolved = {
  ids: string[];
  saved: number;
  collapses: Collapse[];
};

/**
 * Collapses parts into the bundle that contains them.
 *
 * Aerial photography and aerial video are $150 each and $200 together, so
 * anyone who ticks both should be charged $200 and told they saved $100 —
 * not quietly charged $300 for a thing we sell for less.
 */
export function resolveSelection(offerId: string | undefined, selected: string[]): Resolved {
  const offer = getOffer(offerId);
  const collapses: Collapse[] = [];

  const ids = new Set(
    selected.filter((id) => {
      const addOn = getAddOn(id);
      if (!addOn) return false;
      if (!offer) return true;
      if (offer.contains.includes(id)) return false; // already paid for
      return addOn.streams.includes(offer.stream) && !addOn.noShootOnly;
    })
  );

  let saved = 0;

  for (const bundle of BOOKABLE_ADD_ONS) {
    if (!bundle.bundleOf) continue;
    if (offer && !bundle.streams.includes(offer.stream)) continue;

    const parts = bundle.bundleOf
      .map((id) => getAddOn(id))
      .filter((a): a is BookableAddOn => Boolean(a));
    const present = parts.filter((p) => ids.has(p.id));
    if (!present.length) continue;

    if (ids.has(bundle.id)) {
      // The pack is already in. Its parts are along for the ride.
      const freed = present.reduce((sum, p) => sum + p.amount, 0);
      present.forEach((p) => ids.delete(p.id));
      saved += freed;
      collapses.push({
        bundleId: bundle.id,
        bundleName: bundle.name,
        partIds: present.map((p) => p.id),
        saved: freed,
      });
      continue;
    }

    if (present.length === parts.length && !(offer?.contains ?? []).includes(bundle.id)) {
      const apart = parts.reduce((sum, p) => sum + p.amount, 0);
      parts.forEach((p) => ids.delete(p.id));
      ids.add(bundle.id);
      saved += apart - bundle.amount;
      collapses.push({
        bundleId: bundle.id,
        bundleName: bundle.name,
        partIds: parts.map((p) => p.id),
        saved: apart - bundle.amount,
      });
    }
  }

  return { ids: [...ids], saved, collapses };
}

/** Units of an add-on, clamped to what it actually allows. */
export function clampQuantity(addOn: BookableAddOn, units: number): number {
  if (!addOn.quantity) return 1;
  return Math.max(1, Math.min(addOn.quantity.max, Math.round(units) || 1));
}

export type QuoteLine = {
  id: string;
  name: string;
  detail?: string;
  units: number;
  amount: number;
};

export type Quote = {
  offer?: BookableOffer;
  base: number;
  lines: QuoteLine[];
  addOnTotal: number;
  total: number;
  saved: number;
  collapses: Collapse[];
  /** Priced per month rather than once. */
  recurring: boolean;
  /** No number to show — this one gets quoted. */
  quoteOnly: boolean;
};

/**
 * The number on the screen, and the same number the server puts in the email.
 */
export function quote(
  offerId: string | undefined,
  selected: string[] = [],
  quantities: Record<string, number> = {}
): Quote {
  const offer = getOffer(offerId);
  const resolved = resolveSelection(offerId, selected);

  const lines: QuoteLine[] = resolved.ids.flatMap((id) => {
    const addOn = getAddOn(id);
    if (!addOn) return [];
    const units = clampQuantity(addOn, quantities[id] ?? 1);
    return [
      {
        id,
        name: addOn.name,
        detail: addOn.quantity
          ? `${units * addOn.quantity.step} ${addOn.quantity.unit}`
          : addOn.detail,
        units,
        amount: addOn.amount * units,
      },
    ];
  });

  const addOnTotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const quoteOnly = Boolean(offer?.quote);
  const base = quoteOnly ? 0 : offer?.amount ?? 0;

  return {
    offer,
    base,
    lines,
    addOnTotal,
    total: base + addOnTotal,
    saved: resolved.saved,
    collapses: resolved.collapses,
    recurring: Boolean(offer?.recurring),
    quoteOnly,
  };
}

/** What the total says on the card. Retainers are monthly, quotes have no number. */
export function totalLabel(q: Quote): string {
  if (q.quoteOnly) return "Quoted";
  if (q.recurring) return `${money(q.total)}/mo`;
  return money(q.total);
}

/**
 * Delivery is "next business day" everywhere on the site. Weekends only — there
 * is no public-holiday list, so this is used as a hint next to a date field and
 * never printed as a promise.
 */
export function nextBusinessDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

export { money };
