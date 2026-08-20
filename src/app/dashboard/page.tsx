import { AuthGate } from "@/components/dashboard/AuthGate";
import { AnalyticsReport } from "@/components/dashboard/analytics/AnalyticsReport";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <AnalyticsReport />
      </DashboardShell>
    </AuthGate>
  );
}
