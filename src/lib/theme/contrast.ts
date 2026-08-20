import { CONTRAST_RULES, type ContrastRule, type ThemeColors } from "./tokens";

/**
 * WCAG 2.1 relative luminance and contrast ratio.
 *
 * The editor lets anyone pick any colour, so contrast has to be computed live
 * rather than trusted — this is the same maths the spec defines in 1.4.3.
 */

export function normalizeHex(value: string): string | null {
  const raw = value.trim().replace(/^#/, "");
  const expanded =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;

  return /^[0-9a-fA-F]{6}$/.test(expanded) ? `#${expanded.toLowerCase()}` : null;
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const int = parseInt(normalized.slice(1), 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** `#6379c2` → `"99 121 194"`, the space-separated form `rgb()` wants. */
export function hexToChannels(hex: string): string | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgb.join(" ") : null;
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(channelLuminance);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Returns the WCAG ratio between 1 and 21, or `null` if either colour is invalid. */
export function contrastRatio(foreground: string, background: string): number | null {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  if (a === null || b === null) return null;
  const [lighter, darker] = a >= b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastResult extends ContrastRule {
  ratio: number | null;
  passes: boolean;
}

export function evaluateContrast(colors: ThemeColors): ContrastResult[] {
  return CONTRAST_RULES.map((rule) => {
    const ratio = contrastRatio(colors[rule.foreground], colors[rule.background]);
    return { ...rule, ratio, passes: ratio !== null && ratio >= rule.min };
  });
}

export function countContrastFailures(colors: ThemeColors): number {
  return evaluateContrast(colors).filter((result) => !result.passes).length;
}

/**
 * Picks whichever of black or white reads better on a colour.
 *
 * Used to keep swatch labels legible whatever the editor is set to.
 */
export function readableTextOn(hex: string): "#ffffff" | "#111111" {
  const luminance = relativeLuminance(hex);
  if (luminance === null) return "#111111";
  return luminance > 0.42 ? "#111111" : "#ffffff";
}
