import { cuisines } from "@/data/cuisines";
import { dishes } from "@/data/dishes";
import { restaurants } from "@/data/restaurants";

import { routes } from "./utils/routes";

export type SearchEntryType = "restaurant" | "dish" | "cuisine";

export interface SearchIndexEntry {
  id: string;
  type: SearchEntryType;
  label: string;
  sublabel: string;
  href: string;
  image: string;
  /** Pre-lowercased haystack — matching never re-normalises at keystroke time. */
  keywords: string;
}

/**
 * Builds the compact search index.
 *
 * Deliberately called on the server and handed to the client as a prop: the
 * full catalogue (descriptions, outlets, opening hours) is an order of
 * magnitude larger than what search needs, and shipping it to the browser just
 * to filter a few strings would be wasteful. When a search service exists,
 * this function becomes the fetch.
 */
export function buildSearchIndex(): SearchIndexEntry[] {
  const restaurantEntries: SearchIndexEntry[] = restaurants.map((restaurant) => ({
    id: restaurant.id,
    type: "restaurant",
    label: restaurant.name,
    sublabel: `${restaurant.cuisines.slice(0, 2).join(" • ")} · ${restaurant.location.locality}`,
    href: routes.restaurant(restaurant.slug),
    image: restaurant.coverImage,
    keywords: [
      restaurant.name,
      ...restaurant.cuisines,
      restaurant.location.locality,
      ...restaurant.tags,
    ]
      .join(" ")
      .toLowerCase(),
  }));

  const dishEntries: SearchIndexEntry[] = dishes.map((dish) => ({
    id: dish.id,
    type: "dish",
    label: dish.name,
    sublabel: `${dish.restaurantName} · ${dish.location}`,
    href: routes.outletMenu(dish.restaurantSlug, dish.outletSlug),
    image: dish.image,
    keywords: [dish.name, dish.restaurantName, dish.category, dish.location]
      .join(" ")
      .toLowerCase(),
  }));

  const cuisineEntries: SearchIndexEntry[] = cuisines.map((cuisine) => ({
    id: cuisine.id,
    type: "cuisine",
    label: cuisine.name,
    sublabel: `${cuisine.restaurantCount} restaurants in Delhi`,
    href: routes.cuisine(cuisine.slug),
    image: cuisine.image,
    keywords: `${cuisine.name} cuisine`.toLowerCase(),
  }));

  return [...restaurantEntries, ...dishEntries, ...cuisineEntries];
}

/**
 * Substring match, ranked so a prefix hit on the name outranks an incidental
 * match deep in the keyword blob. Good enough for a catalogue of this size;
 * swap for the search service's own ranking when it lands.
 */
export function filterSearchIndex(
  index: SearchIndexEntry[],
  query: string,
  limit = 8,
): SearchIndexEntry[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return [];

  const scored: Array<{ entry: SearchIndexEntry; score: number }> = [];

  for (const entry of index) {
    const label = entry.label.toLowerCase();
    let score = -1;

    if (label.startsWith(needle)) score = 0;
    else if (label.includes(needle)) score = 1;
    else if (entry.keywords.includes(needle)) score = 2;

    if (score >= 0) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => a.score - b.score || a.entry.label.localeCompare(b.entry.label))
    .slice(0, limit)
    .map((item) => item.entry);
}

/** Zero-query state for the search overlay. */
export const trendingSearches = [
  "Butter Chicken",
  "Biryani",
  "Cafes in Hauz Khas",
  "Pure Veg",
  "Chaat",
  "Pizza",
] as const;
