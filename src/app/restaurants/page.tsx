import { Suspense } from "react";
import type { Metadata } from "next";

import {
  RestaurantListing,
  RestaurantListingFallback,
} from "@/components/restaurant/RestaurantListing";
import { restaurants } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Restaurants in Delhi",
  description:
    "Browse every restaurant listed on DineBoard across Delhi — filter by cuisine, diet and locality, compare ratings and offers, and book a table in seconds.",
  path: "/restaurants",
  keywords: [
    "restaurants in Delhi",
    "best restaurants Delhi",
    "Delhi restaurant list",
    "book a table Delhi",
  ],
});

/**
 * Full restaurant listing.
 *
 * GitHub Pages exports the canonical catalogue as HTML. Shareable query
 * filters (`?q=`, `?offers=1`, `?locality=`) are applied after hydration.
 */
export default function RestaurantsPage() {
  return (
    <Suspense fallback={<RestaurantListingFallback restaurants={restaurants} />}>
      <RestaurantListing restaurants={restaurants} />
    </Suspense>
  );
}
