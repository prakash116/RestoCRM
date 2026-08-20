import type { Metadata } from "next";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RevenueReport } from "@/components/dashboard/revenue/RevenueReport";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Revenue Report",
  description: "Payment gateway, revenue and settlement reporting across the restaurant network.",
  path: "/dashboard/revenue",
  noIndex: true,
});

export default function DashboardRevenuePage() {
  return (
    <AuthGate>
      <DashboardShell>
        <RevenueReport />
      </DashboardShell>
    </AuthGate>
  );
}
