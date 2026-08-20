/**
 * Restaurant-facing technology plans.
 *
 * These are B2B subscriptions sold to restaurant owners — not a diner loyalty
 * programme. Commercials are deliberately not encoded as numbers: the sales
 * team owns pricing, so every plan exposes a display string instead.
 */

export interface PlanFeature {
  label: string;
  /** Groups features under sub-headings inside the plan card. */
  group: string;
  /** Rendered muted with an "coming soon" affordance when false. */
  available: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  /** One-line positioning statement. */
  summary: string;
  /** Who the plan is for, shown above the feature list. */
  bestFor: string;
  /**
   * Commercials placeholder — e.g. "Contact Sales", "Starting Plan".
   * Replace with a real price string (or a `price` object) when pricing is
   * finalised; nothing else in the UI needs to change.
   */
  priceLabel: string;
  /** Secondary line under `priceLabel`, e.g. "Billed annually". */
  priceNote: string;
  /** Copy for the "everything in <plan>" inheritance line. */
  inheritsFrom?: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref: string;
  /** Exactly one plan should be flagged; drives the highlighted treatment. */
  recommended: boolean;
}
