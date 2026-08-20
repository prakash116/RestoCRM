"use client";

import { usePathname } from "next/navigation";

import { normalizePathname, routes } from "@/lib/utils/routes";

import { MobileStickyCta } from "./MobileStickyCta";

/**
 * Chooses which chrome wraps the page.
 *
 * The dashboard lives under the same root layout as the marketplace but must
 * not inherit the diner-facing header, footer or sticky CTA — it supplies its
 * own shell. Header and footer arrive as props so they keep rendering on the
 * server; only this switch is a Client Component.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const normalizedPathname = normalizePathname(pathname);

  if (
    normalizedPathname.startsWith(routes.dashboard()) ||
    normalizedPathname === routes.offline()
  ) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
      <MobileStickyCta />
    </>
  );
}
