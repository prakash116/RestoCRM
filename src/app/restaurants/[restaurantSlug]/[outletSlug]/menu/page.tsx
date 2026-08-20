import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, QrCode } from "lucide-react";

import { DietMark } from "@/components/restaurant/DietBadges";
import { Container } from "@/components/ui/Container";
import { getDishesByOutlet } from "@/data/dishes";
import { BLUR_WARM } from "@/data/images";
import { getOutlet } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatRating, formatRupees } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";
import type { Dish, MenuCategory } from "@/types/dish";

interface MenuPageProps {
  params: Promise<{ restaurantSlug: string; outletSlug: string }>;
  /** `?table=` is populated by the QR resolver at `/q/[token]`. */
  searchParams: Promise<{ table?: string }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) {
    return buildMetadata({
      title: "Menu not found",
      description: "This menu is not available on DineBoard.",
      path: routes.outletMenu(restaurantSlug, outletSlug),
      noIndex: true,
    });
  }

  const { restaurant, outlet } = found;

  return buildMetadata({
    title: `${restaurant.name} Menu, ${outlet.name}`,
    description: `The full menu at ${restaurant.name}, ${outlet.name} — dish prices, vegetarian and non-vegetarian marks, and diner ratings.`,
    path: routes.outletMenu(restaurant.slug, outlet.slug),
    image: outlet.image,
    keywords: [`${restaurant.name} menu`, `${restaurant.name} ${outlet.name} price`],
  });
}

/**
 * Outlet menu — the page a QR scan lands on.
 *
 * Server-rendered so it opens instantly on a phone at the table, with no
 * client-side data fetch between the scan and the food.
 */
export default async function OutletMenuPage({ params, searchParams }: MenuPageProps) {
  const { restaurantSlug, outletSlug } = await params;
  const { table } = await searchParams;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) notFound();
  const { restaurant, outlet } = found;

  const dishes = getDishesByOutlet(restaurant.slug, outlet.slug);
  const categories = groupByCategory(dishes);
  const tableNumber = table && /^\d{1,3}$/.test(table) ? Number(table) : null;

  return (
    <Container className="py-12 lg:py-16">
      {tableNumber !== null ? (
        <p className="mb-6 inline-flex items-center gap-2 rounded-pill border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
          <QrCode className="size-4" aria-hidden="true" />
          You are at Table {tableNumber} · {outlet.name}
        </p>
      ) : null}

      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
        Menu at {outlet.name}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Prices are set per outlet and update live — the same menu every table QR opens.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 rounded-panel border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-sm text-muted-foreground">
          This outlet has not published its menu yet.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`menu-${category.id}`}>
              <h3
                id={`menu-${category.id}`}
                className="text-xs font-bold tracking-[0.16em] text-primary uppercase"
              >
                {category.name}
              </h3>

              <ul className="mt-5 divide-y divide-border overflow-hidden rounded-panel border border-border bg-card">
                {category.dishes.map((dish) => (
                  <li key={dish.id} className="flex items-start gap-4 p-4 sm:gap-5 sm:p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <DietMark type={dish.vegType} />
                        <h4 className="text-[0.9375rem] font-bold text-foreground">{dish.name}</h4>
                        {dish.isSignature ? (
                          <span className="rounded-pill bg-primary-soft px-2 py-0.5 text-[0.625rem] font-extrabold tracking-wide text-primary uppercase">
                            Signature
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-foreground tabular-nums">
                        {formatRupees(dish.price)}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <span aria-hidden="true" className="text-star">
                            ★
                          </span>
                          {formatRating(dish.rating)}
                          <span className="sr-only">out of 5</span>
                        </span>
                      </p>

                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {dish.description}
                      </p>
                    </div>

                    {/* Image and action stack together so every row has a
                        per-dish call to action. Labels stay short to fit the
                        column; the accessible name spells out the dish, so a
                        screen-reader user always knows which one they are
                        acting on. */}
                    <div className="flex shrink-0 flex-col items-stretch gap-2">
                      <div className="relative size-20 overflow-hidden rounded-card bg-muted sm:size-24">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          sizes="96px"
                          placeholder="blur"
                          blurDataURL={BLUR_WARM}
                          className="object-cover"
                        />
                      </div>

                      {outlet.acceptsBookings ? (
                        <Link
                          href={routes.bookTable(restaurant.slug, outlet.slug, {
                            dish: dish.id,
                          })}
                          className="inline-flex h-8 items-center justify-center rounded-pill bg-primary px-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-strong"
                        >
                          Book
                          <span className="sr-only"> a table for {dish.name}</span>
                        </Link>
                      ) : (
                        <a
                          href={`tel:${outlet.phone.replace(/-/g, "")}`}
                          className="inline-flex h-8 items-center justify-center gap-1 rounded-pill border border-border px-3 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <Phone className="size-3" aria-hidden="true" />
                          Call
                          <span className="sr-only"> {outlet.name} to order {dish.name}</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}

/** Groups a flat dish list into the menu sections the kitchen prints. */
function groupByCategory(dishes: Dish[]): MenuCategory[] {
  const map = new Map<string, Dish[]>();

  for (const dish of dishes) {
    const existing = map.get(dish.category);
    if (existing) existing.push(dish);
    else map.set(dish.category, [dish]);
  }

  return [...map.entries()].map(([name, items]) => ({
    id: slugify(name),
    name,
    dishes: items,
  }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
