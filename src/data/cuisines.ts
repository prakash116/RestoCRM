import type { Cuisine } from "@/types/restaurant";

import { cuisineImages } from "./images";

export const cuisines: Cuisine[] = [
  {
    id: "cuisine-north-indian",
    name: "North Indian",
    slug: "north-indian",
    image: cuisineImages["north-indian"],
    restaurantCount: 186,
    description:
      "Tandoor breads, slow-cooked gravies and the Delhi classics that anchor almost every menu in the city.",
  },
  {
    id: "cuisine-mughlai",
    name: "Mughlai",
    slug: "mughlai",
    image: cuisineImages.mughlai,
    restaurantCount: 94,
    description:
      "Kebabs, korma and biryani from the kitchens that shaped how Old Delhi eats after sundown.",
  },
  {
    id: "cuisine-chinese",
    name: "Chinese",
    slug: "chinese",
    image: cuisineImages.chinese,
    restaurantCount: 142,
    description:
      "From Indo-Chinese street woks to regional Sichuan menus, plated fast and eaten faster.",
  },
  {
    id: "cuisine-south-indian",
    name: "South Indian",
    slug: "south-indian",
    image: cuisineImages["south-indian"],
    restaurantCount: 78,
    description:
      "Crisp dosas, steamed idlis and filter coffee served through the day across the city.",
  },
  {
    id: "cuisine-italian",
    name: "Italian",
    slug: "italian",
    image: cuisineImages.italian,
    restaurantCount: 66,
    description:
      "Wood-fired pizza, hand-rolled pasta and long dinners in Delhi's neighbourhood trattorias.",
  },
  {
    id: "cuisine-cafe",
    name: "Cafe",
    slug: "cafe",
    image: cuisineImages.cafe,
    restaurantCount: 121,
    description:
      "Single-origin brews, all-day breakfast and the tables Delhi actually gets work done at.",
  },
  {
    id: "cuisine-street-food",
    name: "Street Food",
    slug: "street-food",
    image: cuisineImages["street-food"],
    restaurantCount: 103,
    description:
      "Chaat, kulche and the counters that have run the same recipe for three generations.",
  },
  {
    id: "cuisine-desserts",
    name: "Desserts",
    slug: "desserts",
    image: cuisineImages.desserts,
    restaurantCount: 88,
    description:
      "Mithai counters, patisseries and late-night dessert bars for everything after the meal.",
  },
];

export function getCuisineBySlug(slug: string): Cuisine | undefined {
  return cuisines.find((cuisine) => cuisine.slug === slug);
}

/**
 * Chip options for the restaurant listing filters. `all` plus the discovery
 * cuisines, followed by the two diet filters the brief calls for.
 */
export interface FilterOption {
  id: string;
  label: string;
  kind: "cuisine" | "diet";
}

export const restaurantFilterOptions: FilterOption[] = [
  { id: "all", label: "All", kind: "cuisine" },
  { id: "north-indian", label: "North Indian", kind: "cuisine" },
  { id: "south-indian", label: "South Indian", kind: "cuisine" },
  { id: "chinese", label: "Chinese", kind: "cuisine" },
  { id: "italian", label: "Italian", kind: "cuisine" },
  { id: "cafe", label: "Cafe", kind: "cuisine" },
  { id: "fast-food", label: "Fast Food", kind: "cuisine" },
  { id: "veg", label: "Pure Veg", kind: "diet" },
  { id: "non-veg", label: "Non-Veg", kind: "diet" },
];
