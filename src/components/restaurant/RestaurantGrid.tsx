import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils/cn";
import type { Restaurant } from "@/types/restaurant";

import { RestaurantCard } from "./RestaurantCard";

/**
 * Responsive listing grid — 4 columns on desktop, 2–3 on tablet, 1 on phones.
 *
 * Phones get a single column rather than two: at 375px a two-up grid leaves
 * roughly 160px per card, which is too narrow for the cuisine line and the
 * booking CTA to survive without truncation.
 */
export function RestaurantGrid({
  restaurants,
  /** How many leading cards opt out of lazy loading. */
  priorityCount = 0,
  className,
}: {
  restaurants: Restaurant[];
  priorityCount?: number;
  className?: string;
}) {
  return (
    <RevealGroup
      as="ul"
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {restaurants.map((restaurant, index) => (
        <RevealItem as="li" key={restaurant.id} className="h-full">
          <RestaurantCard restaurant={restaurant} priority={index < priorityCount} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
