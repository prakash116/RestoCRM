import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BookingPanel } from "@/components/restaurant/BookingPanel";
import { DietBadges } from "@/components/restaurant/DietBadges";
import { OfferBadge } from "@/components/restaurant/OfferBadge";
import { QueryBookingPanel } from "@/components/restaurant/QueryBookingPanel";
import { Container } from "@/components/ui/Container";
import { getDishesByRestaurant } from "@/data/dishes";
import { BLUR_WARM } from "@/data/images";
import { getOutlet } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCostForTwo } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface OutletPageProps {
  params: Promise<{ restaurantSlug: string; outletSlug: string }>;
}

export async function generateMetadata({ params }: OutletPageProps): Promise<Metadata> {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) {
    return buildMetadata({
      title: "Outlet not found",
      description: "This outlet is not listed on DineBoard.",
      path: routes.outlet(restaurantSlug, outletSlug),
      noIndex: true,
    });
  }

  const { restaurant, outlet } = found;

  return buildMetadata({
    title: `${restaurant.name}, ${outlet.name}`,
    description: `${restaurant.name} in ${outlet.location.locality}, Delhi. ${restaurant.cuisines.join(", ")} · ${formatCostForTwo(restaurant.costForTwo)}. Address, timings, menu, offers and table booking.`,
    path: routes.outlet(restaurant.slug, outlet.slug),
    image: outlet.image,
    keywords: [
      `${restaurant.name} ${outlet.location.locality}`,
      `${restaurant.name} address`,
      `${restaurant.name} timings`,
    ],
  });
}

export default async function OutletPage({ params }: OutletPageProps) {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) notFound();
  const { restaurant, outlet } = found;

  return (
    <Container className="py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-panel bg-muted">
            <Image
              src={outlet.image}
              alt={`${restaurant.name} at ${outlet.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 52rem, 92vw"
              placeholder="blur"
              blurDataURL={BLUR_WARM}
              className="object-cover"
            />
          </div>

          <h2 className="mt-10 text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            About this outlet
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {restaurant.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <DietBadges
              vegAvailable={restaurant.vegAvailable}
              nonVegAvailable={restaurant.nonVegAvailable}
            />
            <span className="text-sm font-semibold text-muted-foreground">
              {formatCostForTwo(restaurant.costForTwo)}
            </span>
            {restaurant.offer ? <OfferBadge offer={restaurant.offer} /> : null}
          </div>

          <h2 className="mt-10 text-xl font-bold text-foreground">Opening hours</h2>
          <dl className="mt-4 max-w-md divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
            {outlet.hours.map((slot) => (
              <div key={slot.day} className="flex items-center justify-between px-4 py-3 text-sm">
                <dt className="font-medium text-muted-foreground">{DAY_LABELS[slot.day]}</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {slot.opens} – {slot.closes}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 text-xl font-bold text-foreground">Address</h2>
          <address className="mt-3 text-base leading-relaxed text-muted-foreground not-italic">
            {outlet.address}
            <br />
            {outlet.location.locality}, {outlet.location.city} {outlet.location.state}
          </address>
        </div>

        <aside>
          {outlet.acceptsBookings ? (
            <Suspense fallback={<BookingPanel outletName={outlet.name} phone={outlet.phone} />}>
              <QueryBookingPanel
                outletName={outlet.name}
                phone={outlet.phone}
                restaurantSlug={restaurant.slug}
                outletSlug={outlet.slug}
                dishes={getDishesByRestaurant(restaurant.slug)}
              />
            </Suspense>
          ) : (
            <div className="rounded-panel border border-dashed border-border bg-muted/40 p-6">
              <h2 className="text-lg font-bold text-foreground">Walk-ins only</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This outlet runs counter service and does not take table reservations. Scan the QR
                at your table to order straight from the menu.
              </p>
              <a
                href={`tel:${outlet.phone.replace(/-/g, "")}`}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-pill border border-border bg-card text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Call {outlet.name}
              </a>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
