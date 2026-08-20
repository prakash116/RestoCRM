import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

/**
 * The console is an internal surface — kept out of the index and out of the
 * sitemap, and disallowed in `robots.ts`.
 */
export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "Internal DineBoard console.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
