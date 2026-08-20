/**
 * QR token resolution.
 *
 * Scanning a printed code lands the diner on `/q/[token]`. The token is opaque
 * — it never leaks the restaurant or table in the URL — and resolves here to a
 * restaurant, an outlet and (for table codes) the table itself, before the
 * route continues to the live menu.
 *
 * In production this lookup moves behind the QR service. The shape of
 * `QrResolution` is the contract, so only `resolveQrToken` changes.
 */

export interface QrResolution {
  restaurantSlug: string;
  outletSlug: string;
  /** Absent for restaurant-level codes (posters, business cards). */
  tableNumber?: number;
  /** `table` codes can pre-fill a dine-in order; `venue` codes cannot. */
  kind: "table" | "venue";
}

const demoTokens: Record<string, QrResolution> = {
  // Table codes — one per table, printed on the tent card.
  "ct-cp-t12": {
    restaurantSlug: "copper-tandoor",
    outletSlug: "connaught-place",
    tableNumber: 12,
    kind: "table",
  },
  "mfr-gp-t04": {
    restaurantSlug: "madras-filter-room",
    outletSlug: "green-park",
    tableNumber: 4,
    kind: "table",
  },
  "ut-np-t07": {
    restaurantSlug: "urban-tiffin",
    outletSlug: "nehru-place",
    tableNumber: 7,
    kind: "table",
  },
  // Venue codes — the poster at the entrance.
  "tn-hk-venue": {
    restaurantSlug: "trattoria-nove",
    outletSlug: "hauz-khas",
    kind: "venue",
  },
};

export function resolveQrToken(token: string): QrResolution | undefined {
  return demoTokens[token.toLowerCase()];
}

/** Known tokens that can be emitted as static QR entry pages. */
export function getAllQrTokens(): string[] {
  return Object.keys(demoTokens);
}

/** Sample token used by the QR explainer on the homepage. */
export const DEMO_QR_TOKEN = "ct-cp-t12";
