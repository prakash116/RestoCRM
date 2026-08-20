/**
 * The editable design-token schema.
 *
 * This is the contract between `globals.css` and the dashboard theme editor:
 * every token listed here gets a colour input, and every token here is written
 * back to `:root` as a CSS custom property. Adding a token is a one-line change
 * in this file plus a default in each theme.
 */

export const THEME_TOKEN_GROUPS = [
  "Brand",
  "Surfaces",
  "Neutrals",
  "Semantic",
  "Dining",
  "Dark panels",
] as const;

export type ThemeTokenGroup = (typeof THEME_TOKEN_GROUPS)[number];

export interface ThemeTokenDef {
  /** CSS custom property name, without the leading `--`. */
  name: string;
  label: string;
  description: string;
  group: ThemeTokenGroup;
}

export const THEME_TOKENS = [
  /* ---- Brand ----------------------------------------------------------- */
  {
    name: "primary",
    label: "Primary",
    description: "Brand fill: buttons, badges, active chips, borders, focus rings.",
    group: "Brand",
  },
  {
    name: "primary-foreground",
    label: "Primary foreground",
    description: "Label colour on a filled primary surface.",
    group: "Brand",
  },
  {
    name: "primary-strong",
    label: "Primary strong",
    description: "Deeper step for text and icons on light surfaces, and button hover.",
    group: "Brand",
  },
  {
    name: "primary-soft",
    label: "Primary soft",
    description: "Tinted surface behind brand chips and callouts.",
    group: "Brand",
  },
  {
    name: "accent",
    label: "Accent",
    description: "Counter-light in dark panels, haloes and the hero particle field.",
    group: "Brand",
  },

  /* ---- Surfaces --------------------------------------------------------- */
  { name: "background", label: "Background", description: "Page background.", group: "Surfaces" },
  { name: "foreground", label: "Foreground", description: "Body text.", group: "Surfaces" },
  { name: "card", label: "Card", description: "Raised card and panel surface.", group: "Surfaces" },
  {
    name: "card-foreground",
    label: "Card foreground",
    description: "Text on a card surface.",
    group: "Surfaces",
  },

  /* ---- Neutrals --------------------------------------------------------- */
  {
    name: "secondary",
    label: "Secondary",
    description: "Alternating section background.",
    group: "Neutrals",
  },
  {
    name: "secondary-foreground",
    label: "Secondary foreground",
    description: "Text on the secondary surface.",
    group: "Neutrals",
  },
  { name: "muted", label: "Muted", description: "Inset and filled inputs.", group: "Neutrals" },
  {
    name: "muted-foreground",
    label: "Muted foreground",
    description: "Secondary text and metadata.",
    group: "Neutrals",
  },
  { name: "border", label: "Border", description: "Hairlines and dividers.", group: "Neutrals" },
  { name: "input", label: "Input border", description: "Form field borders.", group: "Neutrals" },
  { name: "ring", label: "Focus ring", description: "Keyboard focus outline.", group: "Neutrals" },

  /* ---- Semantic --------------------------------------------------------- */
  { name: "success", label: "Success", description: "Open status, high ratings.", group: "Semantic" },
  {
    name: "success-soft",
    label: "Success soft",
    description: "Tinted surface behind success text.",
    group: "Semantic",
  },
  { name: "warning", label: "Warning", description: "Advisory notices.", group: "Semantic" },
  {
    name: "warning-soft",
    label: "Warning soft",
    description: "Tinted surface behind warning text.",
    group: "Semantic",
  },
  { name: "danger", label: "Danger", description: "Errors and destructive actions.", group: "Semantic" },
  {
    name: "danger-soft",
    label: "Danger soft",
    description: "Tinted surface behind danger text.",
    group: "Semantic",
  },

  /* ---- Dining ----------------------------------------------------------- */
  {
    name: "veg",
    label: "Vegetarian mark",
    description: "FSSAI green. Diners read this as a food-safety signal — change with care.",
    group: "Dining",
  },
  {
    name: "nonveg",
    label: "Non-vegetarian mark",
    description: "FSSAI maroon. Same convention as above.",
    group: "Dining",
  },
  { name: "star", label: "Rating star", description: "Review star fill.", group: "Dining" },

  /* ---- Dark panels ------------------------------------------------------ */
  { name: "ink", label: "Ink", description: "Dark promotional panels and scrims.", group: "Dark panels" },
  {
    name: "ink-foreground",
    label: "Ink foreground",
    description: "Text on dark panels.",
    group: "Dark panels",
  },
  {
    name: "ink-muted",
    label: "Ink muted",
    description: "Secondary text on dark panels.",
    group: "Dark panels",
  },
] as const satisfies readonly ThemeTokenDef[];

/**
 * A single entry from `THEME_TOKENS`, keeping its literal `name`.
 *
 * Using the wider `ThemeTokenDef` here would widen `name` back to `string` and
 * lose the ability to index `ThemeColors` with it.
 */
export type ThemeToken = (typeof THEME_TOKENS)[number];

export type ThemeTokenName = ThemeToken["name"];

/** Colour values keyed by token name. Every value is a 6-digit hex string. */
export type ThemeColors = Record<ThemeTokenName, string>;

/**
 * Tokens whose `-rgb` channel companion is generated, never edited.
 *
 * Decorative washes need the colour at partial alpha, which hex cannot express.
 * Deriving them here means the editor can never leave `--primary` and
 * `--primary-rgb` describing two different colours.
 */
export const DERIVED_CHANNEL_TOKENS = ["primary", "accent", "ink"] as const;

export function tokensByGroup(group: ThemeTokenGroup): readonly ThemeToken[] {
  return THEME_TOKENS.filter((token) => token.group === group);
}

/* -------------------------------------------------------------------------- */
/* Contrast requirements                                                       */
/* -------------------------------------------------------------------------- */

export interface ContrastRule {
  id: string;
  label: string;
  foreground: ThemeTokenName;
  background: ThemeTokenName;
  /** 4.5 for body text, 3 for large text and non-text UI (WCAG 1.4.3 / 1.4.11). */
  min: number;
  /** Explains what breaks when this rule fails. */
  note: string;
}

export const CONTRAST_RULES: ContrastRule[] = [
  {
    id: "body",
    label: "Body text on background",
    foreground: "foreground",
    background: "background",
    min: 4.5,
    note: "Every paragraph on the site.",
  },
  {
    id: "muted",
    label: "Muted text on background",
    foreground: "muted-foreground",
    background: "background",
    min: 4.5,
    note: "Cuisine lines, localities, metadata.",
  },
  {
    id: "muted-on-muted",
    label: "Muted text on muted surface",
    foreground: "muted-foreground",
    background: "muted",
    min: 4.5,
    note: "Inset panels and the booking summary.",
  },
  {
    id: "brand-text",
    label: "Brand text on card",
    foreground: "primary-strong",
    background: "card",
    min: 4.5,
    note: "Section eyebrows and inline brand links.",
  },
  {
    id: "brand-text-soft",
    label: "Brand text on soft chip",
    foreground: "primary-strong",
    background: "primary-soft",
    min: 4.5,
    note: "Offer badges and the active nav pill.",
  },
  {
    id: "button",
    label: "Label on primary button",
    foreground: "primary-foreground",
    background: "primary",
    min: 4.5,
    note: "Every filled call to action.",
  },
  {
    id: "button-hover",
    label: "Label on button hover",
    foreground: "primary-foreground",
    background: "primary-strong",
    min: 4.5,
    note: "Hover state of the same buttons.",
  },
  {
    id: "success",
    label: "Success text on tint",
    foreground: "success",
    background: "success-soft",
    min: 4.5,
    note: "Pure Veg and Open-now badges.",
  },
  {
    id: "warning",
    label: "Warning text on tint",
    foreground: "warning",
    background: "warning-soft",
    min: 4.5,
    note: "Booking and console notices.",
  },
  {
    id: "ink-body",
    label: "Text on dark panel",
    foreground: "ink-foreground",
    background: "ink",
    min: 4.5,
    note: "Promotional slides and the closing CTA.",
  },
  {
    id: "ink-muted",
    label: "Muted text on dark panel",
    foreground: "ink-muted",
    background: "ink",
    min: 4.5,
    note: "Supporting copy in dark panels.",
  },
  {
    id: "brand-ui",
    label: "Brand fill against card",
    foreground: "primary",
    background: "card",
    min: 3,
    note: "Borders, focus rings and filled chips (non-text minimum).",
  },
];
