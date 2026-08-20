import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { GlowCard } from "@/components/ui/GlowCard";
import { BLUR_WARM } from "@/data/images";
import { cn } from "@/lib/utils/cn";
import {
  formatCostForTwo,
  formatDistance,
  formatPriceRange,
} from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";
import type { Restaurant } from "@/types/restaurant";

import { DietBadges } from "./DietBadges";
import { FavoriteButton } from "./FavoriteButton";
import { OfferBadge } from "./OfferBadge";
import { RatingBadge } from "./RatingBadge";

/**
 * The marketplace's primary unit.
 *
 * The card is one link: the restaurant name carries a stretched `::after` that
 * covers the whole card, so there is a single tab stop for the destination
 * while the favourite toggle and the booking CTA sit above it on their own.
 * That keeps the tab order short without losing the large click target.
 */
export function RestaurantCard({
  restaurant,
  /** Only the first row above the fold should load eagerly. */
  priority = false,
}: {
  restaurant: Restaurant;
  priority?: boolean;
}) {
  const href = routes.restaurant(restaurant.slug);
  const primaryOutlet = restaurant.outlets[0];

  return (
    <GlowCard as="article" className="flex h-full flex-col">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={restaurant.coverImage}
          alt={`${restaurant.name} in ${restaurant.location.locality}`}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_WARM}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {/* Scrim only where overlaid text sits, so the food stays bright. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(var(--ink-rgb)/0.78),transparent)]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase backdrop-blur-sm",
              restaurant.isOpen
                ? "bg-white/90 text-success"
                : "bg-ink/80 text-ink-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                restaurant.isOpen ? "bg-success" : "bg-ink-muted",
              )}
            />
            {restaurant.isOpen ? "Open now" : "Closed"}
          </span>

          {/* Above the stretched link so the toggle stays clickable. */}
          <div className="relative z-20">
            <FavoriteButton
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          </div>
        </div>

        {restaurant.offer ? (
          <div className="absolute inset-x-0 bottom-0">
            <OfferBadge offer={restaurant.offer} variant="overlay" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.0625rem] leading-snug font-bold tracking-[-0.01em] text-foreground">
            <Link
              href={href}
              className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              {restaurant.name}
            </Link>
          </h3>
          <RatingBadge value={restaurant.rating.value} size="sm" className="shrink-0 pt-0.5" />
        </div>

        <div className="space-y-1.5">
          <p className="truncate text-sm text-muted-foreground">
            {restaurant.cuisines.join(" • ")}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary-strong/70" aria-hidden="true" />
            <span className="truncate">{restaurant.location.locality}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0 tabular-nums">
              {formatDistance(restaurant.location.distanceKm)}
            </span>
          </p>
        </div>

        <div className="mt-auto space-y-3 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-3">
            <DietBadges
              vegAvailable={restaurant.vegAvailable}
              nonVegAvailable={restaurant.nonVegAvailable}
            />
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
              <span aria-hidden="true">{formatPriceRange(restaurant.priceRange)}</span>
              <span className="sr-only">{formatCostForTwo(restaurant.costForTwo)}</span>
            </span>
          </div>

          <div className="relative z-20 flex items-center gap-2">
            {/* Visual affordance only — the stretched link on the title already
                takes the whole card to this destination, and a second link
                would duplicate the tab stop for no benefit. */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-flex h-9 flex-1 items-center justify-center rounded-pill px-3 text-[0.8125rem] font-semibold",
                "bg-primary-soft text-primary-strong transition-colors duration-200",
                "group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              View Restaurant
            </span>

            {restaurant.acceptsBookings && primaryOutlet ? (
              <Link
                href={routes.bookTable(restaurant.slug, primaryOutlet.slug)}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-pill border border-border px-3.5 text-[0.8125rem] font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary-strong"
              >
                Book Table
                <span className="sr-only"> at {restaurant.name}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
