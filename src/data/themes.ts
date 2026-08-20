import type { StoredThemeState, ThemeDefinition } from "@/lib/theme/apply";

/**
 * Named themes shipped with the platform.
 *
 * `indigo` mirrors the values in `globals.css`, so the dashboard opens showing
 * exactly what the site already renders. The others are complete alternates —
 * every token is specified, because a partial theme would inherit half a
 * palette and produce colour combinations nobody checked.
 */
export const builtInThemes: ThemeDefinition[] = [
  {
    id: "indigo",
    name: "Indigo",
    slug: "indigo",
    description: "The shipped palette. Cool neutrals under an indigo brand.",
    builtIn: true,
    colors: {
      primary: "#6379c2",
      "primary-foreground": "#ffffff",
      "primary-strong": "#46599d",
      "primary-soft": "#eef1fb",
      accent: "#93a7e0",
      background: "#fcfdff",
      foreground: "#12151f",
      card: "#ffffff",
      "card-foreground": "#12151f",
      secondary: "#f1f3fa",
      "secondary-foreground": "#232838",
      muted: "#f4f6fb",
      "muted-foreground": "#5d6478",
      border: "#e2e6f2",
      input: "#d3d9ea",
      ring: "#6379c2",
      success: "#15803d",
      "success-soft": "#ecf8f1",
      warning: "#b45309",
      "warning-soft": "#fdf3e5",
      danger: "#b91c1c",
      "danger-soft": "#fdecec",
      veg: "#1a7f4b",
      nonveg: "#a62c2c",
      star: "#f0a12a",
      ink: "#141827",
      "ink-foreground": "#eef0f7",
      "ink-muted": "#a3aabf",
    },
  },
  {
    id: "tandoor",
    name: "Tandoor",
    slug: "tandoor",
    description: "Warm vermillion over cream neutrals — the original launch palette.",
    builtIn: true,
    colors: {
      primary: "#d63a28",
      "primary-foreground": "#ffffff",
      "primary-strong": "#a82a1b",
      "primary-soft": "#fdece8",
      accent: "#f0a12a",
      background: "#fffcf9",
      foreground: "#1a1310",
      card: "#ffffff",
      "card-foreground": "#1a1310",
      secondary: "#f6f0ea",
      "secondary-foreground": "#33241d",
      muted: "#f7f3ef",
      "muted-foreground": "#6b605a",
      border: "#ece3da",
      input: "#e3d8cd",
      ring: "#d63a28",
      success: "#15803d",
      "success-soft": "#ecf8f1",
      warning: "#b45309",
      "warning-soft": "#fdf3e5",
      danger: "#b91c1c",
      "danger-soft": "#fdecec",
      veg: "#1a7f4b",
      nonveg: "#a62c2c",
      star: "#f0a12a",
      ink: "#1a1210",
      "ink-foreground": "#f8f1ea",
      "ink-muted": "#b8a89c",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    slug: "emerald",
    description: "Deep green with a fresh, produce-forward feel.",
    builtIn: true,
    colors: {
      // #10906c read nicer but put white button labels at 4.02:1, under AA.
      primary: "#0e8563",
      "primary-foreground": "#ffffff",
      "primary-strong": "#0a6b50",
      "primary-soft": "#e6f6f0",
      accent: "#6fd3ae",
      background: "#fbfefd",
      foreground: "#101a17",
      card: "#ffffff",
      "card-foreground": "#101a17",
      secondary: "#eef7f4",
      "secondary-foreground": "#1d302a",
      muted: "#f2f8f6",
      "muted-foreground": "#55635e",
      border: "#dfeae6",
      input: "#cfe0da",
      ring: "#0e8563",
      success: "#15803d",
      "success-soft": "#ecf8f1",
      warning: "#b45309",
      "warning-soft": "#fdf3e5",
      danger: "#b91c1c",
      "danger-soft": "#fdecec",
      veg: "#1a7f4b",
      nonveg: "#a62c2c",
      star: "#f0a12a",
      ink: "#0f1c18",
      "ink-foreground": "#ecf5f2",
      "ink-muted": "#9db3ac",
    },
  },
  {
    id: "graphite",
    name: "Graphite",
    slug: "graphite",
    description: "Monochrome and restrained — lets the food photography carry the colour.",
    builtIn: true,
    colors: {
      primary: "#3f4756",
      "primary-foreground": "#ffffff",
      "primary-strong": "#2b323e",
      "primary-soft": "#eef0f3",
      accent: "#8a94a6",
      background: "#fcfcfd",
      foreground: "#14171c",
      card: "#ffffff",
      "card-foreground": "#14171c",
      secondary: "#f2f3f6",
      "secondary-foreground": "#22262e",
      muted: "#f5f6f8",
      "muted-foreground": "#5c6472",
      border: "#e4e6ec",
      input: "#d5d8e0",
      ring: "#3f4756",
      success: "#15803d",
      "success-soft": "#ecf8f1",
      warning: "#b45309",
      "warning-soft": "#fdf3e5",
      danger: "#b91c1c",
      "danger-soft": "#fdecec",
      veg: "#1a7f4b",
      nonveg: "#a62c2c",
      star: "#f0a12a",
      ink: "#16191f",
      "ink-foreground": "#eef0f4",
      "ink-muted": "#a2a9b6",
    },
  },
];

export const DEFAULT_THEME_ID = "indigo";

/**
 * Reserved slugs for themes created in the dashboard.
 *
 * The site is exported statically for GitHub Pages, so every route must exist
 * as a file at build time — a theme invented in the browser cannot mint a new
 * HTML page. Pre-generating a fixed pool of editable slots keeps "create a
 * theme" working on a static host. On a Node deployment this cap can be lifted
 * by switching the editor route to `dynamicParams`.
 */
export const CUSTOM_THEME_SLUGS = ["custom-1", "custom-2", "custom-3", "custom-4"] as const;

/** Every slug that `generateStaticParams` must prerender. */
export function allThemeSlugs(): string[] {
  return [...builtInThemes.map((theme) => theme.slug), ...CUSTOM_THEME_SLUGS];
}

export function getBuiltInTheme(slug: string): ThemeDefinition | undefined {
  return builtInThemes.find((theme) => theme.slug === slug);
}

export function defaultThemeState(): StoredThemeState {
  return {
    activeThemeId: DEFAULT_THEME_ID,
    // Cloned so reducers can never mutate the shipped constants.
    themes: builtInThemes.map((theme) => ({ ...theme, colors: { ...theme.colors } })),
  };
}
