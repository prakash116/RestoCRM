/**
 * Platform-wide configuration.
 *
 * Anything a stakeholder might want to change without touching a component —
 * brand name, launch city, contact details, headline statistics — lives here.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dineboard.in";

export const siteConfig = {
  name: "DineBoard",
  legalName: "DineBoard Technologies Pvt. Ltd.",
  tagline: "Dining, discovered.",
  /** Trailing slash removed so URL joins never double up. */
  url: rawSiteUrl.replace(/\/$/, ""),
  locale: "en_IN",
  description:
    "Discover top-rated restaurants in Delhi, explore popular dishes and offers, and book your table in seconds. DineBoard also gives restaurants the QR, CRM and operations technology to grow.",
  shortDescription:
    "Discover Delhi's best restaurants, dishes and offers — and book your table in seconds.",

  launchCity: {
    name: "Delhi",
    region: "Delhi NCR",
    state: "Delhi",
    country: "India",
    countryCode: "IN",
  },

  contact: {
    salesEmail: "partners@dineboard.in",
    supportEmail: "support@dineboard.in",
    phone: "+91-11-4000-0000",
  },

  social: {
    instagram: "https://instagram.com/dineboard",
    twitter: "https://x.com/dineboard",
    linkedin: "https://linkedin.com/company/dineboard",
    youtube: "https://youtube.com/@dineboard",
  },

  /** Twitter handle without the URL, used in card metadata. */
  twitterHandle: "@dineboard",

  /**
   * Headline numbers shown in the hero trust strip. These reflect the current
   * demo dataset — swap them for live counts from the listings service before
   * launch.
   */
  stats: [
    { label: "Restaurants onboarding", value: "500+" },
    { label: "Delhi localities", value: "24" },
    { label: "Avg. table booking", value: "30s" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
