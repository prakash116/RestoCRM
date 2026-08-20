import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { Container } from "@/components/ui/Container";
import { cuisines, getCuisineBySlug } from "@/data/cuisines";
import { getRestaurantsByCuisine } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

interface CuisinePageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-renders every cuisine landing page at build time. */
export function generateStaticParams() {
  return cuisines.map((cuisine) => ({ slug: cuisine.slug }));
}

export async function generateMetadata({ params }: CuisinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const cuisine = getCuisineBySlug(slug);

  if (!cuisine) {
    return buildMetadata({
      title: "Cuisine not found",
      description: "This cuisine is not listed on DineBoard yet.",
      path: routes.cuisine(slug),
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Best ${cuisine.name} Restaurants in Delhi`,
    description: `${cuisine.description} Compare ratings, offers and localities across ${cuisine.name} restaurants in Delhi.`,
    path: routes.cuisine(cuisine.slug),
    image: cuisine.image,
    keywords: [
      `${cuisine.name} restaurants Delhi`,
      `best ${cuisine.name} Delhi`,
      `${cuisine.name} food near me`,
    ],
  });
}

export default async function CuisinePage({ params }: CuisinePageProps) {
  const { slug } = await params;
  const cuisine = getCuisineBySlug(slug);

  if (!cuisine) notFound();

  const matches = getRestaurantsByCuisine(cuisine.slug);

  return (
    <>
      <PageHeader
        eyebrow="Explore by cuisine"
        title={`${cuisine.name} Restaurants in Delhi`}
        description={cuisine.description}
        breadcrumbs={[
          { name: "Restaurants", path: routes.restaurants() },
          { name: cuisine.name, path: routes.cuisine(cuisine.slug) },
        ]}
      />

      <Container className="py-12 lg:py-16">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-foreground">
          {matches.length} {matches.length === 1 ? "restaurant" : "restaurants"} listed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Showing {cuisine.name} restaurants currently live on DineBoard. More are onboarding across
          Delhi every week.
        </p>

        {matches.length > 0 ? (
          <RestaurantGrid restaurants={matches} priorityCount={4} className="mt-8" />
        ) : (
          <p className="mt-8 rounded-panel border border-dashed border-border bg-muted/40 px-6 py-16 text-center text-sm text-muted-foreground">
            No {cuisine.name} restaurants are live yet — check back shortly.
          </p>
        )}
      </Container>
    </>
  );
}
