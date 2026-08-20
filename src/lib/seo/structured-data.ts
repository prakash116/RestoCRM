import type { Outlet, Restaurant } from "@/types/restaurant";

import { absoluteUrl, siteConfig } from "./site";

/** Loose JSON-LD node type — avoids `any` without pulling in `schema-dts`. */
export type JsonLdNode = Record<string, unknown>;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/* -------------------------------------------------------------------------- */
/* Site-level graph                                                            */
/* -------------------------------------------------------------------------- */

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    description: siteConfig.description,
    email: siteConfig.contact.supportEmail,
    areaServed: {
      "@type": "City",
      name: siteConfig.launchCity.name,
      containedInPlace: {
        "@type": "Country",
        name: siteConfig.launchCity.country,
      },
    },
    sameAs: Object.values(siteConfig.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.contact.salesEmail,
        areaServed: siteConfig.launchCity.countryCode,
        availableLanguage: ["en", "hi"],
      },
    ],
  };
}

export function webSiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/#organization") },
    // Enables the sitelinks search box once the listings index is public.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/restaurants?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Entity-level                                                                */
/* -------------------------------------------------------------------------- */

interface BreadcrumbEntry {
  name: string;
  /** Site-relative path. */
  path: string;
}

export function breadcrumbSchema(entries: BreadcrumbEntry[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/**
 * `Restaurant` is a subtype of `LocalBusiness`, so a single node satisfies
 * both requirements from the SEO brief. Emitted per outlet, because opening
 * hours and address are outlet-level facts.
 */
export function restaurantSchema(restaurant: Restaurant, outlet?: Outlet): JsonLdNode {
  const target = outlet ?? restaurant.outlets[0];
  const path = outlet
    ? `/restaurants/${restaurant.slug}/${outlet.slug}`
    : `/restaurants/${restaurant.slug}`;

  const node: JsonLdNode = {
    "@type": "Restaurant",
    "@id": absoluteUrl(`${path}#restaurant`),
    name: outlet ? `${restaurant.name} — ${outlet.name}` : restaurant.name,
    url: absoluteUrl(path),
    image: restaurant.images.length ? restaurant.images : [restaurant.coverImage],
    description: restaurant.description,
    servesCuisine: restaurant.cuisines,
    priceRange: "₹".repeat(restaurant.priceRange),
    currenciesAccepted: "INR",
    acceptsReservations: restaurant.acceptsBookings,
    hasMenu: absoluteUrl(
      `/restaurants/${restaurant.slug}/${target.slug}/menu`,
    ),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: restaurant.rating.value,
      reviewCount: restaurant.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };

  if (target) {
    node.address = {
      "@type": "PostalAddress",
      streetAddress: target.address,
      addressLocality: target.location.locality,
      addressRegion: target.location.state,
      addressCountry: siteConfig.launchCity.countryCode,
    };
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: target.location.coordinates.lat,
      longitude: target.location.coordinates.lng,
    };
    node.telephone = target.phone;
    node.openingHoursSpecification = target.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY_NAMES[slot.day]}`,
      opens: slot.opens,
      closes: slot.closes,
    }));
  }

  return node;
}

/**
 * Wraps nodes in a single `@graph` so a page emits exactly one JSON-LD block —
 * easier for crawlers to reconcile than several disconnected scripts.
 */
export function buildGraph(...nodes: JsonLdNode[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
