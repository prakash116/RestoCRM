import type { Metadata } from "next";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RestaurantManagement } from "@/components/dashboard/restaurants/RestaurantManagement";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Restaurant Management",
  description: "Manage restaurant accounts, memberships and onboarding across the DineBoard network.",
  path: "/dashboard/restaurants",
  noIndex: true,
});

export default function DashboardRestaurantsPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <RestaurantManagement />
      </DashboardShell>
    </AuthGate>
  );
}
