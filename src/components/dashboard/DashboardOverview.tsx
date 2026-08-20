"use client";

import Link from "next/link";
import { ArrowRight, Palette, ShieldAlert } from "lucide-react";

import { useAppSelector } from "@/lib/hooks";
import { countContrastFailures } from "@/lib/theme/contrast";
import { THEME_TOKENS } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

export function DashboardOverview() {
  const { themes, activeThemeId, hydrated } = useAppSelector((state) => state.theme);
  const session = useAppSelector((state) => state.auth.session);
  const activeTheme = themes.find((theme) => theme.id === activeThemeId);

  if (!hydrated || !activeTheme) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading console…
      </p>
    );
  }

  const failures = countContrastFailures(activeTheme.colors);

  const stats = [
    { label: "Live theme", value: activeTheme.name },
    { label: "Themes available", value: String(themes.length) },
    { label: "Colour tokens", value: String(THEME_TOKENS.length) },
    {
      label: "Contrast checks",
      value: failures === 0 ? "All pass" : `${failures} below AA`,
      warn: failures > 0,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
        Welcome back, {session?.name.split(" ")[0]}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        The public site is currently painted with{" "}
        <strong className="font-semibold text-foreground">{activeTheme.name}</strong>. Every colour
        below is editable, and changes apply to the site immediately.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-border bg-card p-5">
            <dt className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
              {stat.label}
            </dt>
            <dd
              className={cn(
                "mt-2 text-xl font-extrabold tracking-[-0.02em]",
                stat.warn ? "text-warning" : "text-foreground",
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Link
          href={routes.dashboardThemes()}
          className="group flex items-start gap-4 rounded-card border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-card"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-control bg-primary-soft">
            <Palette className="size-5 text-primary-strong" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-[1.0625rem] font-bold text-foreground">
              Edit themes
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
            <span className="mt-1.5 block text-sm text-muted-foreground">
              {themes.length} named themes, each on its own route with all {THEME_TOKENS.length}{" "}
              colour tokens.
            </span>
          </span>
        </Link>

        <div className="rounded-card border border-warning/25 bg-warning-soft p-5">
          <span className="flex items-center gap-2.5 text-[1.0625rem] font-bold text-warning">
            <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
            Demo console
          </span>
          <p className="mt-2 text-sm leading-relaxed text-warning">
            Sign-in is checked in the browser and themes save to this browser&rsquo;s local storage.
            Other visitors still see the palette shipped in <code>globals.css</code> — use{" "}
            <strong className="font-semibold">Copy CSS</strong> on a theme to publish it.
          </p>
        </div>
      </div>
    </div>
  );
}
