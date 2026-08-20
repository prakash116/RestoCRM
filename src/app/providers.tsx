"use client";

import { MotionConfig } from "motion/react";

import { StoreProvider } from "@/lib/StoreProvider";

/**
 * Client-side providers.
 *
 * Kept in one thin wrapper so the root layout stays a Server Component —
 * `children` are passed through as a prop and therefore still render on the
 * server.
 *
 * `reducedMotion="user"` makes every Motion animation in the app honour the
 * OS-level preference automatically, so individual components never have to
 * branch on it.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </StoreProvider>
  );
}
