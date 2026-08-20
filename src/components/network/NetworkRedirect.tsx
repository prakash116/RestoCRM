"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { OfflineArcade } from "@/components/network/OfflineArcade";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { LAST_ONLINE_ROUTE_KEY } from "@/lib/network/offline-storage";
import { normalizePathname, routes } from "@/lib/utils/routes";

function rememberRoute(pathname: string): void {
  try {
    window.sessionStorage.setItem(LAST_ONLINE_ROUTE_KEY, pathname);
  } catch {
    /* Storage can be unavailable in private browsing; home remains the fallback. */
  }
}

/** Preloads the route and renders an immediate arcade fallback during navigation. */
export function NetworkRedirect({ children }: { children: React.ReactNode }) {
  const online = useOnlineStatus();
  const pathname = usePathname();
  const router = useRouter();
  const offlineRoute = routes.offline();
  const normalizedPathname = normalizePathname(pathname);

  useEffect(() => {
    if (online) router.prefetch(offlineRoute);
  }, [offlineRoute, online, router]);

  useEffect(() => {
    if (online || normalizedPathname === offlineRoute) return;

    rememberRoute(normalizedPathname);
    router.replace(offlineRoute);
  }, [normalizedPathname, offlineRoute, online, router]);

  if (!online && normalizedPathname !== offlineRoute) {
    return <OfflineArcade />;
  }

  return <>{children}</>;
}
