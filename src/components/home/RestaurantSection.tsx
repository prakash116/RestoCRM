import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RestaurantExplorer } from "@/components/restaurant/RestaurantExplorer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/utils/routes";
import type { Restaurant } from "@/types/restaurant";

/**
 * "Restaurants in Delhi" — the marketplace's primary discovery surface.
 *
 * A Server Component: the heading and the whole card grid are in the initial
 * HTML for crawlers. Only `RestaurantExplorer` hydrates, and only because the
 * filter chips need state.
 */
export function RestaurantSection({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <section
      id="restaurants"
      aria-labelledby="restaurants-heading"
      className="scroll-mt-24 py-16 lg:py-24"
    >
      <Container>
        <SectionHeading
          id="restaurants-heading"
          eyebrow="Discover"
          title="Restaurants in Delhi"
          description="Discover restaurants loved by diners across the city."
          action={{ label: "View All Restaurants", href: routes.restaurants() }}
        />

        <RestaurantExplorer restaurants={restaurants} className="mt-8" />

        {/* The heading's inline action is hidden on small screens, so repeat it
            at the end of the list where a phone user actually finishes. */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href={routes.restaurants()}
            className="group inline-flex h-12 items-center gap-2 rounded-pill border border-border bg-card px-6 text-[0.9375rem] font-semibold text-foreground shadow-soft transition-colors hover:border-primary/40 hover:text-primary-strong"
          >
            View All Restaurants
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
