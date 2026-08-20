/**
 * Core marketplace domain models.
 *
 * These mirror the shape the platform API is expected to return, so the
 * presentational layer can be switched from `src/data/*` mock modules to real
 * fetches without touching components.
 */

/** Rupee bands shown as ₹ / ₹₹ / ₹₹₹ / ₹₹₹₹ in the UI. */
export type PriceRange = 1 | 2 | 3 | 4;

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  image: string;
  /** Placeholder until the listings service reports live counts. */
  restaurantCount: number;
  /** Short editorial line used on the cuisine landing page. */
  description: string;
}

export interface RestaurantRating {
  /** 0–5, one decimal place. */
  value: number;
  count: number;
  /** Optional per-axis breakdown surfaced on the reviews tab. */
  breakdown?: {
    food: number;
    service: number;
    ambience: number;
    value: number;
  };
}

export type OfferKind = "percentage" | "flat" | "combo" | "bank";

export interface RestaurantOffer {
  id: string;
  /** Short badge copy, e.g. "20% OFF". */
  label: string;
  description: string;
  kind: OfferKind;
  /** ISO date. Absent means an always-on offer. */
  validTill?: string;
}

export interface RestaurantLocation {
  /** Human-readable neighbourhood, e.g. "Connaught Place". */
  locality: string;
  city: string;
  state: string;
  /** Distance from the selected location, in kilometres. */
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface OutletHours {
  /** 0 = Sunday, matching `Date.prototype.getDay()`. */
  day: number;
  /** 24h "HH:mm". */
  opens: string;
  closes: string;
}

export interface Outlet {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  address: string;
  location: RestaurantLocation;
  phone: string;
  isOpen: boolean;
  hours: OutletHours[];
  seatingCapacity: number;
  /** Drives the "Book Table" affordance. */
  acceptsBookings: boolean;
  /** Table QR codes are minted per outlet — see `src/lib/utils/routes.ts`. */
  qrEnabled: boolean;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  /** Inline SVG-free brand mark URL; falls back to initials when absent. */
  logo?: string;
  coverImage: string;
  /** Gallery used by the restaurant landing page. */
  images: string[];
  tagline: string;
  description: string;
  rating: RestaurantRating;
  /** Denormalised for card rendering; canonical list lives in `cuisines.ts`. */
  cuisines: string[];
  cuisineSlugs: string[];
  location: RestaurantLocation;
  vegAvailable: boolean;
  nonVegAvailable: boolean;
  priceRange: PriceRange;
  /** Indicative cost for two, in rupees. */
  costForTwo: number;
  offer?: RestaurantOffer;
  isOpen: boolean;
  outletCount: number;
  outlets: Outlet[];
  featured: boolean;
  acceptsBookings: boolean;
  /** Marketing tags: "Pure Veg", "Rooftop", "Live Music"… */
  tags: string[];
  /** Membership tier the restaurant is subscribed to. */
  planId: string;
}
