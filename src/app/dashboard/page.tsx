import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <DashboardOverview />
      </DashboardShell>
    </AuthGate>
  );
}
