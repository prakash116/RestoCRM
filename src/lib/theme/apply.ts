import { hexToChannels, normalizeHex } from "./contrast";
import { DERIVED_CHANNEL_TOKENS, THEME_TOKENS, type ThemeColors } from "./tokens";

export const THEME_STORAGE_KEY = "dineboard.theme.v1";

export const THEME_MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export interface ThemeDefinition {
  id: string;
  name: string;
  /** URL segment for `/dashboard/themes/[themeSlug]`. */
  slug: string;
  description: string;
  /** Built-in themes can be edited but not deleted. */
  builtIn: boolean;
  /** Light appearance palette. Kept as `colors` for v1 storage compatibility. */
  colors: ThemeColors;
  /** Dark appearance palette for the same brand combination. */
  darkColors: ThemeColors;
}

/** Shape written to `localStorage`, and read back by the pre-hydration script. */
export interface StoredThemeState {
  activeThemeId: string;
  activeMode: ThemeMode;
  themes: ThemeDefinition[];
}

/** Backward-compatible localStorage boundary for palettes saved before Dark mode existed. */
export interface PersistedThemeDefinition {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  colors?: Partial<ThemeColors>;
  darkColors?: Partial<ThemeColors>;
}

export interface PersistedThemeState {
  activeThemeId?: string;
  activeMode?: ThemeMode;
  themes?: PersistedThemeDefinition[];
}

function readPersistedColors(value: unknown): Partial<ThemeColors> {
  if (!value || typeof value !== "object") return {};

  const source = value as Record<string, unknown>;
  const colors: Partial<ThemeColors> = {};
  for (const token of THEME_TOKENS) {
    const candidate = source[token.name];
    if (typeof candidate !== "string") continue;
    const normalized = normalizeHex(candidate);
    if (normalized) colors[token.name] = normalized;
  }
  return colors;
}

/** Validates the untrusted localStorage payload before Redux sees it. */
export function parsePersistedThemeState(value: unknown): PersistedThemeState | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.themes)) return null;

  const themes: PersistedThemeDefinition[] = [];
  for (const candidate of source.themes) {
    if (!candidate || typeof candidate !== "object") continue;
    const theme = candidate as Record<string, unknown>;
    if (typeof theme.id !== "string") continue;
    themes.push({
      id: theme.id,
      name: typeof theme.name === "string" ? theme.name : undefined,
      slug: typeof theme.slug === "string" ? theme.slug : undefined,
      description: typeof theme.description === "string" ? theme.description : undefined,
      colors: readPersistedColors(theme.colors),
      darkColors: readPersistedColors(theme.darkColors),
    });
  }

  return {
    activeThemeId: typeof source.activeThemeId === "string" ? source.activeThemeId : undefined,
    activeMode: source.activeMode === "dark" ? "dark" : "light",
    themes,
  };
}

export function getThemeColors(theme: ThemeDefinition, mode: ThemeMode): ThemeColors {
  return mode === "dark" ? theme.darkColors : theme.colors;
}

/**
 * Writes a palette onto an element's inline style as CSS custom properties.
 *
 * Inline styles on `:root` beat the stylesheet's `:root` block, so this
 * overrides the shipped defaults without touching the stylesheet — which is
 * what lets the dashboard re-skin a statically exported site.
 */
export function applyThemeColors(colors: ThemeColors, target?: HTMLElement): void {
  const root = target ?? document.documentElement;

  for (const token of THEME_TOKENS) {
    const value = colors[token.name];
    if (value) root.style.setProperty(`--${token.name}`, value);
  }

  // Channel companions are generated, never stored, so the hex and the rgb
  // form can never describe two different colours.
  for (const token of DERIVED_CHANNEL_TOKENS) {
    const channels = hexToChannels(colors[token]);
    if (channels) root.style.setProperty(`--${token}-rgb`, channels);
  }
}

/** Applies both the palette and the native browser appearance for a mode. */
export function applyTheme(
  theme: ThemeDefinition,
  mode: ThemeMode,
  target?: HTMLElement,
): void {
  const root = target ?? document.documentElement;
  root.dataset.themeMode = mode;
  root.style.colorScheme = mode;
  applyThemeColors(getThemeColors(theme, mode), root);
}

/** Removes every property this module sets, restoring the stylesheet defaults. */
export function clearThemeColors(target?: HTMLElement): void {
  const root = target ?? document.documentElement;
  for (const token of THEME_TOKENS) root.style.removeProperty(`--${token.name}`);
  for (const token of DERIVED_CHANNEL_TOKENS) root.style.removeProperty(`--${token}-rgb`);
}

/**
 * Emits the theme as a `:root` block.
 *
 * The dashboard persists to `localStorage`, which is per-browser. To make a
 * theme the shipped default for every visitor, paste this into
 * `src/app/globals.css` and redeploy — this function is the bridge between
 * "previewing a theme" and "publishing one".
 */
export function themeToCss(theme: ThemeDefinition): string {
  function modeBlock(selector: string, mode: ThemeMode): string[] {
    const colors = getThemeColors(theme, mode);
    const lines = THEME_TOKENS.map((token) => `  --${token.name}: ${colors[token.name]};`);
    const derived = DERIVED_CHANNEL_TOKENS.map((token) => {
      const channels = hexToChannels(colors[token]) ?? "0 0 0";
      return `  --${token}-rgb: ${channels};`;
    });

    return [
      `${selector} {`,
      `  color-scheme: ${mode};`,
      ...lines,
      "",
      "  /* Derived channels — regenerate rather than edit by hand. */",
      ...derived,
      "}",
    ];
  }

  return [
    `/* ${theme.name} — generated by the DineBoard theme dashboard. */`,
    ...modeBlock(':root, :root[data-theme-mode="light"]', "light"),
    "",
    ...modeBlock(':root[data-theme-mode="dark"]', "dark"),
    "",
  ].join("\n");
}

/**
 * Source of the blocking script injected into `<head>`.
 *
 * It runs while the browser parses the HTML — before the first paint and long
 * before React hydrates — so a saved theme never flashes the shipped palette
 * first. Kept dependency-free and wrapped in try/catch because `localStorage`
 * throws outright in some privacy modes.
 */
export function themeBootstrapScript(): string {
  const tokenNames = JSON.stringify(THEME_TOKENS.map((token) => token.name));
  const derivedNames = JSON.stringify([...DERIVED_CHANNEL_TOKENS]);

  return `(function(){try{
var raw=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(!raw)return;
var s=JSON.parse(raw);
if(!s||!s.themes)return;
var t=null;
for(var i=0;i<s.themes.length;i++){if(s.themes[i].id===s.activeThemeId){t=s.themes[i];break}}
if(!t||!t.colors)return;
var mode=s.activeMode==="dark"?"dark":"light";
var c=mode==="dark"&&t.darkColors?t.darkColors:t.colors;
var r=document.documentElement,n=${tokenNames},d=${derivedNames},k,v,h,x;
r.setAttribute("data-theme-mode",mode);r.style.colorScheme=mode;
var meta=document.querySelector('meta[name="theme-color"]');if(meta&&c.background)meta.setAttribute("content",c.background);
for(var j=0;j<n.length;j++){k=n[j];v=c[k];if(v)r.style.setProperty("--"+k,v)}
for(var m=0;m<d.length;m++){
k=d[m];v=c[k];if(!v)continue;
h=v.replace("#","");
if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
if(!/^[0-9a-fA-F]{6}$/.test(h))continue;
x=parseInt(h,16);
r.style.setProperty("--"+k+"-rgb",((x>>16)&255)+" "+((x>>8)&255)+" "+(x&255));
}
}catch(e){}})()`.replace(/\n/g, "");
}
