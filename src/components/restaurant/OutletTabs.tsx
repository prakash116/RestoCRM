"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

/**
 * Outlet section navigation.
 *
 * Real links, not JavaScript tab panels: each view is its own indexable URL
 * with its own metadata, which is the whole point of giving outlets separate
 * menu, offers and reviews routes.
 */
export function OutletTabs({
  restaurantSlug,
  outletSlug,
}: {
  restaurantSlug: string;
  outletSlug: string;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", href: routes.outlet(restaurantSlug, outletSlug) },
    { label: "Menu", href: routes.outletMenu(restaurantSlug, outletSlug) },
    { label: "Offers", href: routes.outletOffers(restaurantSlug, outletSlug) },
    { label: "Reviews", href: routes.outletReviews(restaurantSlug, outletSlug) },
  ];

  return (
    <nav aria-label="Outlet sections" className="border-b border-border">
      <ul className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-12 items-center border-b-2 px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "border-primary text-primary-strong"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
