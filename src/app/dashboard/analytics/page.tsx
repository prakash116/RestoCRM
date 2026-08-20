import type { Metadata } from "next";

import { AnalyticsReport } from "@/components/dashboard/analytics/AnalyticsReport";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Overall Analytics",
  description: "Platform-wide restaurant, membership, customer and revenue reports.",
  path: "/dashboard/analytics",
  noIndex: true,
});

export default function DashboardAnalyticsPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <AnalyticsReport />
      </DashboardShell>
    </AuthGate>
  );
}
