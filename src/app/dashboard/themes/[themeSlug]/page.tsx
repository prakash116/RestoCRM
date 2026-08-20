import type { Metadata } from "next";

import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ThemeEditor } from "@/components/dashboard/ThemeEditor";
import { allThemeSlugs, getBuiltInTheme } from "@/data/themes";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

interface ThemePageProps {
  params: Promise<{ themeSlug: string }>;
}

/**
 * Prerenders a route per named theme, plus the reserved custom slots.
 *
 * The site is exported as static files, so a theme created in the browser
 * cannot mint a new HTML page — the slots exist so "create a theme" still has
 * somewhere to live. See `CUSTOM_THEME_SLUGS` in `src/data/themes.ts`.
 */
export function generateStaticParams() {
  return allThemeSlugs().map((themeSlug) => ({ themeSlug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { themeSlug } = await params;
  const theme = getBuiltInTheme(themeSlug);

  return buildMetadata({
    title: theme ? `${theme.name} theme` : "Theme editor",
    description: "Edit the platform colour palette.",
    path: routes.dashboardTheme(themeSlug),
    noIndex: true,
  });
}

export default async function DashboardThemePage({ params }: ThemePageProps) {
  const { themeSlug } = await params;

  return (
    <AuthGate>
      <DashboardShell>
        {/* Resolved on the client: custom themes live in browser storage, so
            the server has no way to know what this slug currently holds. */}
        <ThemeEditor themeSlug={themeSlug} />
      </DashboardShell>
    </AuthGate>
  );
}
