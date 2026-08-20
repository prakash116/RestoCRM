"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BadgePercent, SearchX } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { getDishesByRestaurant } from "@/data/dishes";
import { routes } from "@/lib/utils/routes";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantExplorer } from "./RestaurantExplorer";

interface ListingQuery {
  query: string;
  offersOnly: boolean;
  locality?: string;
}

/** Applies shareable listing query filters in the browser on static hosts. */
export function RestaurantListing({ restaurants }: { restaurants: Restaurant[] }) {
  const searchParams = useSearchParams();

  return (
    <RestaurantListingView
      restaurants={restaurants}
      query={{
        query: searchParams.get("q")?.trim() ?? "",
        offersOnly: searchParams.get("offers") === "1",
        locality: searchParams.get("locality") ?? undefined,
      }}
    />
  );
}

/** Static HTML shown while the query string becomes available during hydration. */
export function RestaurantListingFallback({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <RestaurantListingView
      restaurants={restaurants}
      query={{ query: "", offersOnly: false }}
    />
  );
}

function RestaurantListingView({
  restaurants,
  query: { query, offersOnly, locality },
}: {
  restaurants: Restaurant[];
  query: ListingQuery;
}) {
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
              We are onboarding restaurants across Delhi every week. Try a cuisine, a dish name or
              a locality — or browse the full listing.
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
  { query, offersOnly, locality }: ListingQuery,
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
      ...getDishesByRestaurant(restaurant.slug).map((dish) => dish.name),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}
