import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RestaurantDetails } from "@/components/dashboard/restaurants/details/RestaurantDetails";
import { managedRestaurants } from "@/data/dashboard-restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

interface RestaurantDetailPageProps {
  params: Promise<{ restaurantId: string }>;
}

/** GitHub Pages can only serve detail pages generated during the static export. */
export function generateStaticParams() {
  return managedRestaurants.map(({ id: restaurantId }) => ({ restaurantId }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: RestaurantDetailPageProps): Promise<Metadata> {
  const { restaurantId } = await params;
  const restaurant = managedRestaurants.find((record) => record.id === restaurantId);

  return buildMetadata({
    title: restaurant ? `${restaurant.name} overview` : "Restaurant not found",
    description: restaurant
      ? `Review revenue, orders, customers, membership, outlets and menu performance for ${restaurant.name}.`
      : "This dashboard restaurant record is unavailable.",
    path: routes.dashboardRestaurant(restaurantId),
    noIndex: true,
  });
}

export default async function DashboardRestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const { restaurantId } = await params;
  if (!managedRestaurants.some((restaurant) => restaurant.id === restaurantId)) notFound();

  return (
    <AuthGate>
      <DashboardShell>
        <RestaurantDetails restaurantId={restaurantId} />
      </DashboardShell>
    </AuthGate>
  );
}
