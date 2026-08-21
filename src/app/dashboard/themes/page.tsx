import type { Metadata } from "next";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ThemeList } from "@/components/dashboard/ThemeList";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Themes",
  description: "Create and manage paired Light and Dark brand themes.",
  path: "/dashboard/themes",
  noIndex: true,
});

export default function DashboardThemesPage() {
  return (
    <AuthGate>
      <DashboardShell>
        <ThemeList />
      </DashboardShell>
    </AuthGate>
  );
}
