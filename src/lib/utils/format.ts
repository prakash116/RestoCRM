import type { PriceRange } from "@/types/restaurant";

/**
 * Locales are pinned explicitly so the server and client render identical
 * strings — an implicit locale is a classic hydration-mismatch source.
 */
const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** `495` → `₹495` */
export function formatRupees(value: number): string {
  return rupeeFormatter.format(value);
}

/** `1240` → `1.2K`, `18400` → `18.4K`, `1200000` → `1.2M` */
export function formatCompactCount(value: number): string {
  if (value < 1000) return String(value);
  if (value < 100_000) {
    const thousands = value / 1000;
    // Drop the decimal once we're past 3 digits: "12.4K" reads fine, "124.0K"
    // does not.
    return `${thousands >= 100 ? Math.round(thousands) : trimZero(thousands)}K`;
  }
  return `${trimZero(value / 1_000_000)}M`;
}

function trimZero(value: number): string {
  const fixed = value.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

/** `2.4` → `2.4 km`, `0.65` → `650 m` */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${trimZero(km)} km`;
}

/** Price band as repeated rupee glyphs, e.g. `₹₹₹`. */
export function formatPriceRange(range: PriceRange): string {
  return "₹".repeat(range);
}

export function formatCostForTwo(cost: number): string {
  return `${formatRupees(cost)} for two`;
}

/** Ratings always render with exactly one decimal: `4.7`, `5.0`. */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

/**
 * Rating colour bands mirror the conventions Indian diners already read:
 * green is excellent, amber is good, muted is everything else.
 */
export function ratingTone(value: number): "high" | "mid" | "low" {
  if (value >= 4.5) return "high";
  if (value >= 4.0) return "mid";
  return "low";
}

/** `"connaught-place"` → `"Connaught Place"` */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
