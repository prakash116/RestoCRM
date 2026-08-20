import type { Metadata } from "next";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RevenueReport } from "@/components/dashboard/revenue/RevenueReport";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Revenue Analytics",
  description: "Payment gateway, revenue and settlement analytics across the restaurant network.",
  path: "/dashboard/analytics",
  noIndex: true,
});

export default function DashboardAnalyticsPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <RevenueReport />
      </DashboardShell>
    </AuthGate>
  );
}
