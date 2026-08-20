import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/ui/SearchBar";
import { cuisines } from "@/data/cuisines";
import type { SearchIndexEntry } from "@/lib/search";
import { siteConfig } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

import { HeroVisual } from "./HeroVisual";

/**
 * Marketplace hero.
 *
 * A Server Component: the headline, supporting copy and every link are in the
 * initial HTML. Only the search field and the floating visual hydrate, and the
 * text entrances are CSS keyframes rather than JS so nothing above the fold
 * waits for React.
 */
export function Hero({ searchIndex }: { searchIndex: SearchIndexEntry[] }) {
  const quickCuisines = cuisines.slice(0, 5);

  return (
    <section
      aria-labelledby="hero-heading"
      // `overflow-x-clip` rather than `overflow-hidden`: the decorative blobs
      // and floating cards still get clipped sideways, but an open location
      // dropdown is free to extend past the bottom of the section instead of
      // being cut off. `overflow-hidden` would force the vertical axis to
      // scroll/clip too.
      className="relative isolate overflow-x-clip pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24"
    >
      {/* Layered warm background. Pure CSS — no image cost before the fold. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_15%_0%,rgba(253,236,232,0.9),transparent_60%),radial-gradient(55%_50%_at_92%_10%,rgba(253,242,227,0.95),transparent_65%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-px bg-border"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 xl:gap-16">
          <div className="max-w-2xl">
            <div className="animate-rise" style={{ animationDelay: "40ms" }}>
              <AnimatedBadge tone="brand" pulse>
                <Sparkles className="size-3.5" aria-hidden="true" />
                Now live across {siteConfig.launchCity.region}
              </AnimatedBadge>
            </div>

            <h1
              id="hero-heading"
              className="animate-rise mt-6 text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-foreground sm:text-6xl xl:text-[4.25rem]"
              style={{ animationDelay: "110ms" }}
            >
              Discover Delhi&rsquo;s{" "}
              <span className="font-display font-normal text-primary italic">Best</span> Restaurants
            </h1>

            <p
              className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
              style={{ animationDelay: "180ms" }}
            >
              Explore top-rated restaurants, discover popular dishes, book your table and experience
              dining smarter.
            </p>

            {/* `relative z-20` puts the search — and any panel it opens — above
                the rows that follow it. Each `animate-rise` element animates
                `transform` with `animation-fill-mode: both`, which makes every
                one of them its own stacking context at `z-auto`; without an
                explicit order here, DOM order wins and the later rows paint
                straight over an open dropdown. */}
            <div className="animate-rise relative z-20 mt-8" style={{ animationDelay: "250ms" }}>
              <SearchBar index={searchIndex} />
            </div>

            <div
              className="animate-rise mt-6 flex flex-wrap items-center gap-x-3 gap-y-2"
              style={{ animationDelay: "320ms" }}
            >
              <span className="text-sm font-semibold text-muted-foreground">Popular:</span>
              {quickCuisines.map((cuisine) => (
                <Link
                  key={cuisine.id}
                  href={routes.cuisine(cuisine.slug)}
                  className="rounded-pill border border-border bg-card/70 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                >
                  {cuisine.name}
                </Link>
              ))}
            </div>

            <div
              className="animate-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "390ms" }}
            >
              <Link
                href={routes.listRestaurant()}
                className="group inline-flex h-12 items-center gap-2 rounded-pill border border-border bg-card px-6 text-[0.9375rem] font-semibold text-foreground shadow-soft transition-[border-color,color,box-shadow] duration-200 hover:border-primary/40 hover:text-primary hover:shadow-card"
              >
                List Your Restaurant
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={routes.pricing()}
                className="inline-flex h-12 items-center rounded-pill px-4 text-[0.9375rem] font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                View membership plans
              </Link>
            </div>

            <dl
              className="animate-rise mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6"
              style={{ animationDelay: "460ms" }}
            >
              {siteConfig.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-extrabold tracking-[-0.02em] text-foreground sm:text-[1.75rem]">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-muted-foreground sm:text-[0.8125rem]">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise lg:pl-4" style={{ animationDelay: "160ms" }}>
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
