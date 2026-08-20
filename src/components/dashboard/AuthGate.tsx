"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";
import { routes } from "@/lib/utils/routes";

/**
 * Client-side gate for dashboard routes.
 *
 * ⚠️ This keeps the console tidy — it is **not** a security boundary. The
 * pages are statically exported, so anyone can fetch the HTML directly and the
 * credential list ships in the bundle. Treat it as a demo affordance; real
 * protection needs server-side session checks before any of this controls
 * production data.
 *
 * Redirecting waits for `hydrated`, otherwise every refresh of a signed-in
 * page would bounce to the login screen before `localStorage` had been read.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated && !session) router.replace(routes.dashboardLogin());
  }, [hydrated, session, router]);

  if (!hydrated) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6">
        <p className="text-sm text-muted-foreground" role="status">
          Checking your session…
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <p className="text-lg font-bold text-foreground">Sign in required</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting you to the dashboard login…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
