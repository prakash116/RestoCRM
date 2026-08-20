import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, QrCode } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OutletTabs } from "@/components/restaurant/OutletTabs";
import { RatingBadge } from "@/components/restaurant/RatingBadge";
import { Container } from "@/components/ui/Container";
import { getAllOutletPaths, getOutlet } from "@/data/restaurants";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildGraph, restaurantSchema } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

interface OutletLayoutProps {
  children: React.ReactNode;
  params: Promise<{ restaurantSlug: string; outletSlug: string }>;
}

export function generateStaticParams() {
  return getAllOutletPaths();
}

/**
 * Shared chrome for every outlet view.
 *
 * The header, breadcrumbs and structured data live here so the menu, offers
 * and reviews routes stay thin — and so the `Restaurant`/`LocalBusiness`
 * JSON-LD is emitted exactly once per outlet, with that outlet's address and
 * opening hours.
 */
export default async function OutletLayout({ children, params }: OutletLayoutProps) {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) notFound();
  const { restaurant, outlet } = found;

  const hours = outlet.hours[0];

  return (
    <>
      <JsonLd data={buildGraph(restaurantSchema(restaurant, outlet))} />

      <section className="relative isolate overflow-hidden border-b border-border pt-8 pb-0">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_10%_0%,rgba(253,236,232,0.85),transparent_62%)]"
        />

        <Container>
          <Breadcrumbs
            items={[
              { name: "Restaurants", path: routes.restaurants() },
              { name: restaurant.name, path: routes.restaurant(restaurant.slug) },
              { name: outlet.name, path: routes.outlet(restaurant.slug, outlet.slug) },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[0.6875rem] font-bold tracking-wide uppercase",
                    outlet.isOpen
                      ? "bg-success-soft text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full",
                      outlet.isOpen ? "bg-success" : "bg-muted-foreground",
                    )}
                  />
                  {outlet.isOpen ? "Open now" : "Closed"}
                </span>
                <RatingBadge value={restaurant.rating.value} count={restaurant.rating.count} />
              </div>

              <h1 className="text-balance-tight mt-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-[2.75rem]">
                {restaurant.name}
                <span className="text-muted-foreground"> — {outlet.name}</span>
              </h1>

              <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary/70" aria-hidden="true" />
                  {outlet.address}
                </li>
                {hours ? (
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-primary/70" aria-hidden="true" />
                    <span className="tabular-nums">
                      {hours.opens} – {hours.closes}
                    </span>
                  </li>
                ) : null}
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-primary/70" aria-hidden="true" />
                  <a
                    href={`tel:${outlet.phone.replace(/-/g, "")}`}
                    className="rounded-sm tabular-nums transition-colors hover:text-primary"
                  >
                    {outlet.phone}
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={routes.outletMenu(restaurant.slug, outlet.slug)}
                className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
              >
                <QrCode className="size-4" aria-hidden="true" />
                View Menu
              </Link>
              {outlet.acceptsBookings ? (
                <Link
                  href={routes.bookTable(restaurant.slug, outlet.slug)}
                  className="inline-flex h-11 items-center rounded-pill border border-border bg-card px-5 text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Book a Table
                </Link>
              ) : null}
            </div>
          </div>

          <OutletTabs restaurantSlug={restaurant.slug} outletSlug={outlet.slug} />
        </Container>
      </section>

      {children}
    </>
  );
}
