import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, SearchX } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { RestaurantExplorer } from "@/components/restaurant/RestaurantExplorer";
import { Container } from "@/components/ui/Container";
import { getDishesByRestaurant } from "@/data/dishes";
import { restaurants } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";
import type { Restaurant } from "@/types/restaurant";

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

interface ListingSearchParams {
  q?: string;
  offers?: string;
  locality?: string;
}

/**
 * Full restaurant listing.
 *
 * Query-driven narrowing (`?q=`, `?offers=1`, `?locality=`) happens on the
 * server so search results are crawlable and shareable; the cuisine and diet
 * chips then refine the result set on the client without a round trip.
 */
export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const { q, offers, locality } = await searchParams;
  const query = q?.trim() ?? "";
  const offersOnly = offers === "1";

  const results = filterRestaurants(restaurants, { query, offersOnly, locality });

  const title = query
    ? `Restaurants matching “${query}” in Delhi`
    : offersOnly
      ? "Restaurants with live offers in Delhi"
      : "Restaurants in Delhi";

  const description = query
    ? `${results.length} ${results.length === 1 ? "restaurant matches" : "restaurants match"} “${query}” across Delhi.`
    : offersOnly
      ? "Every restaurant currently running a discount, combo or bank offer."
      : "Discover restaurants loved by diners across the city — filter by cuisine, diet and locality.";

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title={title}
        description={description}
        breadcrumbs={[{ name: "Restaurants", path: routes.restaurants() }]}
        actions={
          offersOnly ? (
            <Link
              href={routes.restaurants()}
              className="inline-flex h-11 items-center gap-2 rounded-pill border border-border bg-card px-5 text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Show all restaurants
            </Link>
          ) : (
            <Link
              href={routes.offers()}
              className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
            >
              <BadgePercent className="size-4" aria-hidden="true" />
              Only show offers
            </Link>
          )
        }
      />

      <Container className="py-12 lg:py-16">
        {results.length > 0 ? (
          <RestaurantExplorer restaurants={results} priorityCount={4} />
        ) : (
          <div className="rounded-panel border border-dashed border-border bg-muted/40 px-6 py-20 text-center">
            <SearchX className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-bold text-foreground">Nothing matched that search</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We are onboarding restaurants across Delhi every week. Try a cuisine, a dish name or a
              locality — or browse the full listing.
            </p>
            <Link
              href={routes.restaurants()}
              className="mt-7 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
            >
              Browse all restaurants
            </Link>
          </div>
        )}
      </Container>
    </>
  );
}

function filterRestaurants(
  source: Restaurant[],
  { query, offersOnly, locality }: { query: string; offersOnly: boolean; locality?: string },
): Restaurant[] {
  const needle = query.toLowerCase();

  return source.filter((restaurant) => {
    if (offersOnly && !restaurant.offer) return false;
    if (locality && restaurant.location.locality.toLowerCase() !== locality.toLowerCase()) {
      return false;
    }
    if (!needle) return true;

    const haystack = [
      restaurant.name,
      restaurant.tagline,
      ...restaurant.cuisines,
      ...restaurant.tags,
      restaurant.location.locality,
      // Dish names matter here: the header search suggests dishes, so someone
      // who types "butter" and presses Enter instead of picking a suggestion
      // must still land on the restaurants that serve butter chicken.
      ...getDishesByRestaurant(restaurant.slug).map((dish) => dish.name),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}
