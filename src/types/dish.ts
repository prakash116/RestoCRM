/** FSSAI-style diet classification used across menus and dish cards. */
export type VegType = "veg" | "non-veg" | "egg";

export interface Dish {
  id: string;
  /** Relationship kept explicit so dishes can be resolved against the
   *  restaurants service once the API is live. */
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  /** Outlet the price/availability belongs to. */
  outletSlug: string;
  name: string;
  description: string;
  image: string;
  /** Price in rupees (integer — no sub-rupee menu pricing in India). */
  price: number;
  rating: number;
  reviewCount: number;
  vegType: VegType;
  /** Trending position within the selected city; lower is hotter. */
  rank: number;
  /** Denormalised locality string for the card's second line. */
  location: string;
  category: string;
  /** Marks house specials with an accent treatment. */
  isSignature: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  dishes: Dish[];
}
