import type { Dish } from "@/types/dish";

import { dishImages } from "./images";

/**
 * Trending dishes for the Delhi launch.
 *
 * `restaurantId` / `restaurantSlug` / `outletSlug` are stored explicitly so a
 * dish can be resolved against the restaurants service — and deep-linked into
 * the right outlet's menu — without a join table on the client.
 */
export const dishes: Dish[] = [
  {
    id: "dish-butter-chicken",
    restaurantId: "rst-copper-tandoor",
    restaurantSlug: "copper-tandoor",
    restaurantName: "Copper Tandoor",
    outletSlug: "connaught-place",
    name: "Butter Chicken",
    description:
      "Tandoor-roasted chicken finished in a tomato and cashew gravy, with white butter folded in at the pass.",
    image: dishImages["dish-butter-chicken"],
    price: 495,
    rating: 4.8,
    reviewCount: 3240,
    vegType: "non-veg",
    rank: 1,
    location: "Connaught Place",
    category: "Main Course",
    isSignature: true,
  },
  {
    id: "dish-galouti-kebab",
    restaurantId: "rst-nawabs-table",
    restaurantSlug: "nawabs-table",
    restaurantName: "Nawab's Table",
    outletSlug: "karol-bagh",
    name: "Galouti Kebab",
    description:
      "Minced mutton kebabs bound with raw papaya and twenty spices, seared on a flat tawa and served with warqi paratha.",
    image: dishImages["dish-galouti-kebab"],
    price: 525,
    rating: 4.8,
    reviewCount: 1860,
    vegType: "non-veg",
    rank: 2,
    location: "Karol Bagh",
    category: "Starters",
    isSignature: true,
  },
  {
    id: "dish-dal-makhani",
    restaurantId: "rst-copper-tandoor",
    restaurantSlug: "copper-tandoor",
    restaurantName: "Copper Tandoor",
    outletSlug: "connaught-place",
    name: "Dal Makhani",
    description:
      "Whole black lentils simmered overnight on low coal, finished with cream and a smoked butter tempering.",
    image: dishImages["dish-dal-makhani"],
    price: 345,
    rating: 4.7,
    reviewCount: 2410,
    vegType: "veg",
    rank: 3,
    location: "Connaught Place",
    category: "Main Course",
    isSignature: true,
  },
  {
    id: "dish-dum-biryani",
    restaurantId: "rst-saffron-junction",
    restaurantSlug: "saffron-junction",
    restaurantName: "Saffron Junction",
    outletSlug: "saket",
    name: "Hyderabadi Dum Biryani",
    description:
      "Long-grain rice layered with marinated meat and saffron milk, sealed with dough and finished over coal.",
    image: dishImages["dish-dum-biryani"],
    price: 465,
    rating: 4.6,
    reviewCount: 4120,
    vegType: "non-veg",
    rank: 4,
    location: "Saket",
    category: "Biryani",
    isSignature: true,
  },
  {
    id: "dish-masala-dosa",
    restaurantId: "rst-madras-filter-room",
    restaurantSlug: "madras-filter-room",
    restaurantName: "Madras Filter Room",
    outletSlug: "green-park",
    name: "Ghee Roast Masala Dosa",
    description:
      "Fermented rice crepe roasted in ghee until glass-thin, filled with soft potato masala and served with three chutneys.",
    image: dishImages["dish-masala-dosa"],
    price: 245,
    rating: 4.7,
    reviewCount: 1980,
    vegType: "veg",
    rank: 5,
    location: "Green Park",
    category: "Breakfast",
    isSignature: true,
  },
  {
    id: "dish-paneer-tikka",
    restaurantId: "rst-char-and-ember",
    restaurantSlug: "char-and-ember",
    restaurantName: "Char & Ember",
    outletSlug: "defence-colony",
    name: "Malai Paneer Tikka",
    description:
      "Hand-set paneer marinated in cream cheese and green cardamom, charred on skewers over open coal.",
    image: dishImages["dish-paneer-tikka"],
    price: 395,
    rating: 4.5,
    reviewCount: 1340,
    vegType: "veg",
    rank: 6,
    location: "Defence Colony",
    category: "Starters",
    isSignature: false,
  },
  {
    id: "dish-aloo-tikki-chaat",
    restaurantId: "rst-dilli-chaat-company",
    restaurantSlug: "dilli-chaat-company",
    restaurantName: "Dilli Chaat Company",
    outletSlug: "chandni-chowk",
    name: "Aloo Tikki Chaat",
    description:
      "Griddled potato tikki crushed with white peas, sweet and green chutney, dahi and a fistful of sev.",
    image: dishImages["dish-aloo-tikki-chaat"],
    price: 120,
    rating: 4.6,
    reviewCount: 5210,
    vegType: "veg",
    rank: 7,
    location: "Chandni Chowk",
    category: "Chaat",
    isSignature: true,
  },
  {
    id: "dish-chole-bhature",
    restaurantId: "rst-green-leaf-bhojanalya",
    restaurantSlug: "green-leaf-bhojanalya",
    restaurantName: "Green Leaf Bhojanalya",
    outletSlug: "lajpat-nagar",
    name: "Chole Bhature",
    description:
      "Slow-cooked Punjabi chole with a pair of hand-stretched bhature fried to order, with pickled onion.",
    image: dishImages["dish-chole-bhature"],
    price: 185,
    rating: 4.7,
    reviewCount: 3890,
    vegType: "veg",
    rank: 8,
    location: "Lajpat Nagar",
    category: "Main Course",
    isSignature: true,
  },
  {
    id: "dish-truffle-pizza",
    restaurantId: "rst-trattoria-nove",
    restaurantSlug: "trattoria-nove",
    restaurantName: "Trattoria Nove",
    outletSlug: "hauz-khas",
    name: "Truffle Mushroom Pizza",
    description:
      "Forty-eight-hour dough, fior di latte, roasted button and oyster mushrooms, finished with truffle oil.",
    image: dishImages["dish-truffle-pizza"],
    price: 680,
    rating: 4.6,
    reviewCount: 720,
    vegType: "veg",
    rank: 9,
    location: "Hauz Khas",
    category: "Pizza",
    isSignature: false,
  },
  {
    id: "dish-chilli-garlic-noodles",
    restaurantId: "rst-bamboo-wok",
    restaurantSlug: "bamboo-wok",
    restaurantName: "Bamboo Wok",
    outletSlug: "rajouri-garden",
    name: "Chilli Garlic Noodles",
    description:
      "Hakka noodles tossed on high flame with burnt garlic, bird's eye chilli and julienned vegetables.",
    image: dishImages["dish-chilli-garlic-noodles"],
    price: 320,
    rating: 4.4,
    reviewCount: 1640,
    vegType: "veg",
    rank: 10,
    location: "Rajouri Garden",
    category: "Noodles",
    isSignature: false,
  },
  {
    id: "dish-tiramisu-jar",
    restaurantId: "rst-sugar-and-saffron",
    restaurantSlug: "sugar-and-saffron",
    restaurantName: "Sugar & Saffron",
    outletSlug: "vasant-kunj",
    name: "Tiramisu Jar",
    description:
      "Espresso-soaked savoiardi layered with mascarpone cream and a dusting of single-origin cocoa.",
    image: dishImages["dish-tiramisu-jar"],
    price: 295,
    rating: 4.7,
    reviewCount: 940,
    vegType: "egg",
    rank: 11,
    location: "Vasant Kunj",
    category: "Desserts",
    isSignature: true,
  },
  {
    id: "dish-chicken-momos",
    restaurantId: "rst-urban-tiffin",
    restaurantSlug: "urban-tiffin",
    restaurantName: "Urban Tiffin",
    outletSlug: "nehru-place",
    name: "Steamed Chicken Momos",
    description:
      "Eight hand-pleated dumplings steamed to order, served with a roasted tomato and Kashmiri chilli chutney.",
    image: dishImages["dish-chicken-momos"],
    price: 165,
    rating: 4.3,
    reviewCount: 6120,
    vegType: "non-veg",
    rank: 12,
    location: "Nehru Place",
    category: "Snacks",
    isSignature: false,
  },
];

/** Trending order, lowest rank first. */
export function getTrendingDishes(limit = dishes.length): Dish[] {
  return [...dishes].sort((a, b) => a.rank - b.rank).slice(0, limit);
}

export function getDishById(id: string): Dish | undefined {
  return dishes.find((dish) => dish.id === id);
}

export function getDishesByRestaurant(restaurantSlug: string): Dish[] {
  return dishes.filter((dish) => dish.restaurantSlug === restaurantSlug);
}

export function getDishesByOutlet(restaurantSlug: string, outletSlug: string): Dish[] {
  // Dishes are priced per outlet in the real schema; the demo dataset carries
  // one canonical outlet per dish, so fall back to the restaurant's full list.
  const exact = dishes.filter(
    (dish) => dish.restaurantSlug === restaurantSlug && dish.outletSlug === outletSlug,
  );
  return exact.length > 0 ? exact : getDishesByRestaurant(restaurantSlug);
}
