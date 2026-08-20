import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgePercent } from "lucide-react";

import { OfferBadge } from "@/components/restaurant/OfferBadge";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { getOutlet } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

interface OffersPageProps {
  params: Promise<{ restaurantSlug: string; outletSlug: string }>;
}

export async function generateMetadata({ params }: OffersPageProps): Promise<Metadata> {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) {
    return buildMetadata({
      title: "Offers not found",
      description: "This outlet is not listed on DineBoard.",
      path: routes.outletOffers(restaurantSlug, outletSlug),
      noIndex: true,
    });
  }

  const { restaurant, outlet } = found;

  return buildMetadata({
    title: `Offers at ${restaurant.name}, ${outlet.name}`,
    description: `Live discounts, combos and bank offers running at ${restaurant.name} in ${outlet.location.locality}, Delhi.`,
    path: routes.outletOffers(restaurant.slug, outlet.slug),
    image: outlet.image,
    keywords: [`${restaurant.name} offers`, `${restaurant.name} discount ${outlet.location.locality}`],
  });
}

export default async function OutletOffersPage({ params }: OffersPageProps) {
  const { restaurantSlug, outletSlug } = await params;
  const found = getOutlet(restaurantSlug, outletSlug);

  if (!found) notFound();
  const { restaurant, outlet } = found;

  const offers = restaurant.offer ? [restaurant.offer] : [];

  return (
    <Container className="py-12 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
        Offers at {outlet.name}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Offers are set by the restaurant and apply on the bill at this outlet unless stated
        otherwise.
      </p>

      {offers.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {offers.map((offer) => (
            <li key={offer.id}>
              <GlowCard className="h-full rounded-panel p-6">
                <OfferBadge offer={offer} />
                <h3 className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-foreground">
                  {offer.label}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {offer.description}
                </p>
                {offer.validTill ? (
                  <p className="mt-4 text-xs font-semibold text-muted-foreground">
                    Valid until {offer.validTill}
                  </p>
                ) : (
                  <p className="mt-4 text-xs font-semibold text-muted-foreground">
                    Running until further notice
                  </p>
                )}
              </GlowCard>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-panel border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
          <BadgePercent className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold text-foreground">No offers running right now</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            This outlet is not running a promotion at the moment. Browse restaurants with live
            offers across Delhi instead.
          </p>
          <Link
            href={routes.offers()}
            className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            See all offers
          </Link>
        </div>
      )}
    </Container>
  );
}
