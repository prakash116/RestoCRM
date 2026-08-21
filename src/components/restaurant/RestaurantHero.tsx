import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Store, UtensilsCrossed } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { BLUR_DARK } from "@/data/images";
import { cn } from "@/lib/utils/cn";
import { formatCompactCount, formatCostForTwo, formatRating } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";
import type { Restaurant } from "@/types/restaurant";

import { DietBadges } from "./DietBadges";
import { OfferBadge } from "./OfferBadge";

/**
 * Masthead for a restaurant landing page — the storefront a Digital Presence
 * or Restaurant Pro subscriber gets on the public web.
 */
export function RestaurantHero({ restaurant }: { restaurant: Restaurant }) {
  const primaryOutlet = restaurant.outlets[0];

  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <Image
        src={restaurant.coverImage}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DARK}
        className="-z-20 object-cover opacity-40"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgb(var(--ink-rgb)/0.94)_10%,rgb(var(--ink-rgb)/0.72)_55%,rgb(var(--ink-rgb)/0.5)_100%)]"
      />

      <Container className="pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[0.6875rem] font-bold tracking-wide uppercase",
                restaurant.isOpen ? "bg-success text-background" : "bg-white/15 text-ink-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  restaurant.isOpen ? "bg-background" : "bg-ink-muted",
                )}
              />
              {restaurant.isOpen ? "Open now" : "Closed"}
            </span>

            {restaurant.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-white/20 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-wide text-ink-foreground uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-balance-tight mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.5rem]">
            {restaurant.name}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {restaurant.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-control bg-success px-2 py-1 text-[0.8125rem] font-bold text-background tabular-nums">
                <span aria-hidden="true">★</span>
                {formatRating(restaurant.rating.value)}
              </span>
              <span className="text-ink-muted">
                {formatCompactCount(restaurant.rating.count)} reviews
              </span>
            </span>

            <span className="inline-flex items-center gap-2 text-ink-muted">
              <UtensilsCrossed className="size-4 shrink-0" aria-hidden="true" />
              {restaurant.cuisines.join(" • ")}
            </span>

            <span className="inline-flex items-center gap-2 text-ink-muted">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {restaurant.location.locality}, {restaurant.location.city}
            </span>

            <span className="inline-flex items-center gap-2 text-ink-muted">
              <Store className="size-4 shrink-0" aria-hidden="true" />
              {restaurant.outletCount} {restaurant.outletCount === 1 ? "outlet" : "outlets"}
            </span>

            <span className="inline-flex items-center gap-2 text-ink-muted">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              {formatCostForTwo(restaurant.costForTwo)}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <DietBadges
              vegAvailable={restaurant.vegAvailable}
              nonVegAvailable={restaurant.nonVegAvailable}
              className="[&_span]:text-ink-muted"
            />
            {restaurant.offer ? <OfferBadge offer={restaurant.offer} /> : null}
          </div>

          {primaryOutlet ? (
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={routes.outletMenu(restaurant.slug, primaryOutlet.slug)}
                className="inline-flex h-12 items-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary-strong"
              >
                View Menu
              </Link>

              {restaurant.acceptsBookings ? (
                <Link
                  href={routes.bookTable(restaurant.slug, primaryOutlet.slug)}
                  className="inline-flex h-12 items-center rounded-pill border border-white/30 px-6 text-[0.9375rem] font-semibold text-ink-foreground backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
                >
                  Book a Table
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
