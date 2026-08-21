"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Palette,
  ShieldCheck,
  Store,
} from "lucide-react";

import { LogoMark } from "@/components/ui/Logo";
import { signOut } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

const nav = [
  { label: "Overview", href: routes.dashboard(), icon: LayoutDashboard },
  { label: "Restaurants", href: routes.dashboardRestaurants(), icon: Store },
  { label: "Analytics", href: routes.dashboardAnalytics(), icon: ChartNoAxesCombined },
  { label: "Themes", href: routes.dashboardThemes(), icon: Palette },
];

/** Sidebar + header chrome for every signed-in dashboard page. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const activeTheme = useAppSelector((state) =>
    state.theme.themes.find((theme) => theme.id === state.theme.activeThemeId),
  );
  const reportingPage =
    pathname === routes.dashboard() ||
    pathname.startsWith(routes.dashboardAnalytics()) ||
    pathname.startsWith(routes.dashboardRevenue());
  const restaurantPage = pathname.startsWith(routes.dashboardRestaurants());

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40 lg:flex-row">
      <aside className="shrink-0 border-b border-border bg-card lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-2.5 px-5 py-4 lg:py-5">
          <LogoMark className="size-8" />
          <span className="text-[1.05rem] leading-none font-extrabold tracking-[-0.03em] text-foreground">
            Dine<span className="font-semibold text-primary-strong">Board</span>
          </span>
          <span className="ml-auto rounded-pill bg-muted px-2 py-1 text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">
            Console
          </span>
        </div>

        <nav
          aria-label="Dashboard"
          className="scrollbar-none overflow-x-auto px-3 pb-3 lg:overflow-visible lg:pb-5"
        >
          <ul className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== routes.dashboard() && pathname.startsWith(item.href));

              return (
                <li key={item.href} className="lg:flex-none">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-w-[6.75rem] items-center justify-center gap-2 rounded-control px-3 py-2.5 text-sm font-semibold transition-colors lg:min-w-0 lg:justify-start lg:gap-2.5",
                      active
                        ? "bg-primary-soft text-primary-strong"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-border px-5 py-4 lg:block">
          <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
            Live theme
          </p>
          <p className="mt-1.5 text-sm font-bold text-foreground">{activeTheme?.name ?? "—"}</p>
          <Link
            href={routes.home()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-strong hover:underline"
          >
            View public site
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-3.5 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {session?.name ?? "Signed out"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session?.email} · {session?.role}
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(signOut())}
            className="ml-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-pill border border-border px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </header>

        <main id="main" className="min-w-0 flex-1 px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>

        <footer className="border-t border-border px-5 py-4 lg:px-8">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              {restaurantPage ? (
                <>
                  Restaurant management demo. Account actions and edits are illustrative UI data
                  saved only in this browser and are not connected to a live restaurant database.
                </>
              ) : reportingPage ? (
                <>
                  Reporting demo. Analytics and revenue figures are illustrative UI data and are
                  not connected to a billing, gateway, membership or customer database.
                </>
              ) : (
                <>
                  Demo console. Sign-in is checked in the browser and themes are saved to this
                  browser&rsquo;s local storage — it is not authentication and not shared with other
                  visitors. Use <strong className="font-semibold">Copy CSS</strong> on a theme to
                  publish it for everyone.
                </>
              )}
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
