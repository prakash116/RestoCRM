import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DishCard } from "@/components/dish/DishCard";
import { OutletCard } from "@/components/restaurant/OutletCard";
import { RestaurantHero } from "@/components/restaurant/RestaurantHero";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getDishesByRestaurant } from "@/data/dishes";
import { BLUR_WARM } from "@/data/images";
import { getRestaurantBySlug, restaurants } from "@/data/restaurants";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildGraph, restaurantSchema } from "@/lib/seo/structured-data";
import { routes } from "@/lib/utils/routes";

interface RestaurantPageProps {
  params: Promise<{ restaurantSlug: string }>;
}

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({ restaurantSlug: restaurant.slug }));
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { restaurantSlug } = await params;
  const restaurant = getRestaurantBySlug(restaurantSlug);

  if (!restaurant) {
    return buildMetadata({
      title: "Restaurant not found",
      description: "This restaurant is not listed on DineBoard.",
      path: routes.restaurant(restaurantSlug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${restaurant.name}, ${restaurant.location.locality}`,
    description: `${restaurant.tagline}. ${restaurant.cuisines.join(", ")} in ${restaurant.location.locality}, Delhi — rated ${restaurant.rating.value}/5 by ${restaurant.rating.count} diners. Menu, offers, outlets and table booking.`,
    path: routes.restaurant(restaurant.slug),
    image: restaurant.coverImage,
    keywords: [
      restaurant.name,
      `${restaurant.name} ${restaurant.location.locality}`,
      `${restaurant.cuisines[0]} restaurant ${restaurant.location.locality}`,
      `${restaurant.name} menu`,
    ],
  });
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { restaurantSlug } = await params;
  const restaurant = getRestaurantBySlug(restaurantSlug);

  if (!restaurant) notFound();

  const dishes = getDishesByRestaurant(restaurant.slug);

  return (
    <>
      {/* One Restaurant node for the brand; each outlet page emits its own with
          address and opening hours. */}
      <JsonLd data={buildGraph(restaurantSchema(restaurant))} />

      <RestaurantHero restaurant={restaurant} />

      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Restaurants", path: routes.restaurants() },
            { name: restaurant.name, path: routes.restaurant(restaurant.slug) },
          ]}
        />
      </Container>

      <Container className="py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
              About {restaurant.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>

            <h3 className="mt-10 text-lg font-bold text-foreground">Gallery</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {restaurant.images.map((image, index) => (
                <li
                  key={image}
                  className="relative aspect-4/3 overflow-hidden rounded-card bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${restaurant.name} interior and dishes, photo ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 18rem, 45vw"
                    placeholder="blur"
                    blurDataURL={BLUR_WARM}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>

          <aside aria-labelledby="highlights-heading">
            <h2 id="highlights-heading" className="text-lg font-bold text-foreground">
              Highlights
            </h2>
            <ul className="mt-4 space-y-2.5">
              {restaurant.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-control border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-soft"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {restaurant.rating.breakdown ? (
              <>
                <h2 className="mt-10 text-lg font-bold text-foreground">Rating breakdown</h2>
                <dl className="mt-4 space-y-3">
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
              </>
            ) : null}
          </aside>
        </div>
      </Container>

      <section aria-labelledby="outlets-heading" className="bg-secondary/40 py-12 lg:py-16">
        <Container>
          <h2
            id="outlets-heading"
            className="text-2xl font-extrabold tracking-[-0.02em] text-foreground"
          >
            {restaurant.outletCount} {restaurant.outletCount === 1 ? "Outlet" : "Outlets"} in Delhi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each outlet keeps its own timings, seating and table QR codes.
          </p>

          <RevealGroup
            as="ul"
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {restaurant.outlets.map((outlet) => (
              <RevealItem as="li" key={outlet.id} className="h-full">
                <OutletCard restaurant={restaurant} outlet={outlet} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {dishes.length > 0 ? (
        <Container className="py-12 lg:py-16">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            Popular at {restaurant.name}
          </h2>
          <RevealGroup
            as="ul"
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {dishes.map((dish) => (
              <RevealItem as="li" key={dish.id} className="h-full">
                <DishCard dish={dish} showRank={false} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      ) : null}
    </>
  );
}
