import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info, Star } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { getDishesByRestaurant } from "@/data/dishes";
import { getOutlet } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCompactCount, formatRating } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";

interface ReviewsPageProps {
  params: Promise<{ restaurantSlug: string; outletSlug: string }>;
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) {
    return buildMetadata({
      title: "Reviews not found",
      description: "This outlet is not listed on DineBoard.",
      path: routes.outletReviews(restaurantSlug, outletSlug),
      noIndex: true,
    });
  }

  const { restaurant, outlet } = found;

  return buildMetadata({
    title: `${restaurant.name} Reviews, ${outlet.name}`,
    description: `${restaurant.name} in ${outlet.location.locality} is rated ${restaurant.rating.value} out of 5 by ${restaurant.rating.count} diners. See the rating breakdown and what people mention most.`,
    path: routes.outletReviews(restaurant.slug, outlet.slug),
    image: outlet.image,
    keywords: [`${restaurant.name} reviews`, `${restaurant.name} rating`],
  });
}

/**
 * Star distribution derived from the aggregate score.
 *
 * The demo dataset carries aggregates only, so the histogram is computed from
 * the mean rather than invented per-review. It is replaced wholesale by the
 * real distribution once the reviews service is wired in.
 */
function deriveDistribution(rating: number): Array<{ stars: number; share: number }> {
  const spread = [0, 0, 0, 0, 0];
  // Concentrate weight around the mean, with a long thin tail downwards.
  for (let stars = 5; stars >= 1; stars -= 1) {
    const distance = Math.abs(rating - stars);
    spread[stars - 1] = Math.max(0.02, Math.exp(-distance * 1.9));
  }
  const total = spread.reduce((sum, value) => sum + value, 0);

  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    share: Math.round((spread[stars - 1] / total) * 100),
  }));
}

export default async function OutletReviewsPage({ params }: ReviewsPageProps) {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) notFound();
  const { restaurant, outlet } = found;

  const distribution = deriveDistribution(restaurant.rating.value);
  const mentioned = [
    ...getDishesByRestaurant(restaurant.slug)
      .filter((dish) => dish.isSignature)
      .map((dish) => dish.name),
    ...restaurant.tags,
  ].slice(0, 6);

  return (
    <Container className="py-12 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
        Reviews for {outlet.name}
      </h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <GlowCard interactive={false} className="rounded-panel p-6">
          <div className="flex items-end gap-3">
            <span className="text-5xl leading-none font-extrabold tracking-[-0.03em] text-foreground tabular-nums">
              {formatRating(restaurant.rating.value)}
            </span>
            <span className="pb-1.5 text-sm text-muted-foreground">out of 5</span>
          </div>

          <div className="mt-3 flex items-center gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  star <= Math.round(restaurant.rating.value)
                    ? "size-5 fill-star text-star"
                    : "size-5 text-border"
                }
              />
            ))}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Based on {formatCompactCount(restaurant.rating.count)} diner ratings
          </p>

          <ul className="mt-6 space-y-2">
            {distribution.map((row) => (
              <li key={row.stars} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 font-semibold text-muted-foreground tabular-nums">
                  {row.stars} ★
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 flex-1 overflow-hidden rounded-pill bg-muted"
                >
                  <span
                    className="block h-full rounded-pill bg-star"
                    style={{ width: `${row.share}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right font-medium text-muted-foreground tabular-nums">
                  {row.share}%
                </span>
              </li>
            ))}
          </ul>
        </GlowCard>

        <div>
          {restaurant.rating.breakdown ? (
            <GlowCard interactive={false} className="rounded-panel p-6">
              <h3 className="text-lg font-bold text-foreground">What diners rate</h3>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                {Object.entries(restaurant.rating.breakdown).map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <dt className="font-medium text-muted-foreground capitalize">{label}</dt>
                      <dd className="font-bold text-foreground tabular-nums">
                        {value.toFixed(1)}
                      </dd>
                    </div>
                    <div
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-muted"
                    >
                      <div
                        className="h-full rounded-pill bg-success"
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            </GlowCard>
          ) : null}

          <GlowCard interactive={false} className="mt-6 rounded-panel p-6">
            <h3 className="text-lg font-bold text-foreground">Mentioned most</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {mentioned.map((item) => (
                <li
                  key={item}
                  className="rounded-pill border border-border bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </GlowCard>

          <p className="mt-6 flex items-start gap-2.5 rounded-control border border-border bg-muted/50 px-4 py-3.5 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Individual written reviews appear here once diners start reviewing this outlet.
              Ratings shown are demonstration data for the Delhi launch build.
            </span>
          </p>
        </div>
      </div>
    </Container>
  );
}
