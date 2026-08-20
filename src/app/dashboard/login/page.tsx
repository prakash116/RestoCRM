import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/dashboard/LoginForm";
import { LogoMark } from "@/components/ui/Logo";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard Login",
  description: "Sign in to the DineBoard console.",
  path: "/dashboard/login",
  noIndex: true,
});

export default function DashboardLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-muted/40 px-5 py-14">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5">
          <LogoMark className="size-9" />
          <span className="text-[1.32rem] leading-none font-extrabold tracking-[-0.03em] text-foreground">
            Dine<span className="font-semibold text-primary-strong">Board</span>
          </span>
        </div>

        <div className="mt-6 rounded-panel border border-border bg-card p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            Sign in to the console
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage the platform theme and see what the public site is rendering.
          </p>

          <div className="mt-7">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Looking for the restaurant console?{" "}
          <Link
            href={routes.restaurantLogin()}
            className="rounded-sm font-semibold text-primary-strong hover:underline"
          >
            Restaurant login
          </Link>
        </p>
      </div>
    </div>
  );
}
