import type { Metadata } from "next";

import { DishCard } from "@/components/dish/DishCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getTrendingDishes } from "@/data/dishes";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Popular Dishes in Delhi",
  description:
    "The dishes Delhi is ordering most this week — butter chicken, galouti kebab, dum biryani and more, with the restaurants serving them and what they cost.",
  path: "/dishes",
  keywords: ["popular dishes Delhi", "best butter chicken Delhi", "trending food Delhi"],
});

export default function DishesPage() {
  const dishes = getTrendingDishes();

  return (
    <>
      <PageHeader
        eyebrow="Trending now"
        title="Popular Dishes in Delhi"
        description="Ranked by what diners are ordering and rating across the city this week."
        breadcrumbs={[{ name: "Popular Dishes", path: routes.dishes() }]}
      />

      <Container className="py-12 lg:py-16">
        <RevealGroup
          as="ul"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {dishes.map((dish) => (
            <RevealItem as="li" key={dish.id} className="h-full">
              <DishCard dish={dish} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </>
  );
}
