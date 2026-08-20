"use client";

import { useMemo } from "react";
import { SearchX } from "lucide-react";

import { FilterChip } from "@/components/ui/FilterChip";
import { restaurantFilterOptions } from "@/data/cuisines";
import { resetFilters, setCuisine, setDiet } from "@/lib/features/restaurants/restaurantsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/cn";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantGrid } from "./RestaurantGrid";

/**
 * Filter chips + filtered grid.
 *
 * Shared by the homepage section and the full listing page so the two can
 * never drift apart. The catalogue arrives as a prop from a Server Component —
 * only the selected filter lives on the client, in Redux, because the header
 * and the listing page read the same selection.
 */
export function RestaurantExplorer({
  restaurants,
  className,
  /** Leading cards that skip lazy-loading (listing page only — above the fold). */
  priorityCount = 0,
}: {
  restaurants: Restaurant[];
  className?: string;
  priorityCount?: number;
}) {
  const dispatch = useAppDispatch();
  const { cuisine, diet } = useAppSelector((state) => state.restaurants);

  const activeId = diet !== "all" ? diet : cuisine;

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: restaurants.length };

    for (const option of restaurantFilterOptions) {
      if (option.id === "all") continue;
      result[option.id] =
        option.kind === "cuisine"
          ? restaurants.filter((item) => item.cuisineSlugs.includes(option.id)).length
          : restaurants.filter((item) =>
              option.id === "veg"
                ? item.vegAvailable && !item.nonVegAvailable
                : item.nonVegAvailable,
            ).length;
    }

    return result;
  }, [restaurants]);

  const visible = useMemo(
    () =>
      restaurants.filter((restaurant) => {
        if (cuisine !== "all" && !restaurant.cuisineSlugs.includes(cuisine)) return false;
        if (diet === "veg" && !(restaurant.vegAvailable && !restaurant.nonVegAvailable)) {
          return false;
        }
        if (diet === "non-veg" && !restaurant.nonVegAvailable) return false;
        return true;
      }),
    [cuisine, diet, restaurants],
  );

  return (
    <div className={cn(className)}>
      <div
        role="group"
        aria-label="Filter restaurants by cuisine and diet"
        className="scrollbar-none -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0"
      >
        {restaurantFilterOptions.map((option) => (
          <FilterChip
            key={option.id}
            label={option.label}
            count={counts[option.id]}
            active={activeId === option.id}
            onClick={() => {
              if (option.id === "all") {
                dispatch(resetFilters());
              } else if (option.kind === "cuisine") {
                dispatch(setDiet("all"));
                dispatch(setCuisine(option.id));
              } else {
                dispatch(setCuisine("all"));
                dispatch(setDiet(option.id as "veg" | "non-veg"));
              }
            }}
          />
        ))}
      </div>

      {/* Announces the new result count without moving focus off the chip. */}
      <p aria-live="polite" className="sr-only">
        {visible.length} restaurants match the selected filters.
      </p>

      {visible.length > 0 ? (
        <RestaurantGrid restaurants={visible} priorityCount={priorityCount} className="mt-8" />
      ) : (
        <div className="mt-8 rounded-panel border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
          <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold text-foreground">No restaurants match that yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            We are onboarding new kitchens across Delhi every week. Try another cuisine, or clear
            the filters to see everything.
          </p>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
