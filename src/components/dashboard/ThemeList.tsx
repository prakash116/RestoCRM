"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";

import { CUSTOM_THEME_SLUGS } from "@/data/themes";
import { activateTheme, createTheme } from "@/lib/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { countContrastFailures } from "@/lib/theme/contrast";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

/** Swatch strip showing the colours that define a theme at a glance. */
function ThemeSwatches({ colors }: { colors: Record<string, string> }) {
  const keys = ["primary", "primary-strong", "accent", "ink", "background", "star"];

  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {keys.map((key) => (
        <span
          key={key}
          style={{ backgroundColor: colors[key] }}
          className="size-6 rounded-md border border-border"
        />
      ))}
    </div>
  );
}

export function ThemeList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { themes, activeThemeId, hydrated } = useAppSelector((state) => state.theme);
  const [name, setName] = useState("");

  const usedSlugs = new Set(themes.map((theme) => theme.slug));
  const freeSlot = CUSTOM_THEME_SLUGS.find((slug) => !usedSlugs.has(slug));

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!freeSlot) return;
    dispatch(createTheme({ name, seedFromThemeId: activeThemeId }));
    setName("");
    router.push(routes.dashboardTheme(freeSlot));
  }

  if (!hydrated) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading themes…
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">Themes</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Each theme has its own route and its own copy of every colour token. Open one to fill in
        the colours, then activate it to repaint the public site.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
          const failures = countContrastFailures(theme.colors);
          const isActive = theme.id === activeThemeId;

          return (
            <li key={theme.id}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-card border bg-card p-5 transition-[border-color,box-shadow]",
                  isActive ? "border-primary shadow-card" : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[1.0625rem] font-bold text-foreground">
                    <Link
                      href={routes.dashboardTheme(theme.slug)}
                      className="rounded-sm hover:text-primary-strong"
                    >
                      {theme.name}
                    </Link>
                  </h2>
                  {isActive ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-success-soft px-2 py-1 text-[0.625rem] font-bold tracking-wide text-success uppercase">
                      <Check className="size-3" aria-hidden="true" />
                      Live
                    </span>
                  ) : null}
                </div>

                <p className="mt-1.5 text-sm text-muted-foreground">{theme.description}</p>

                <div className="mt-4">
                  <ThemeSwatches colors={theme.colors} />
                </div>

                <p
                  className={cn(
                    "mt-4 text-xs font-semibold",
                    failures === 0 ? "text-success" : "text-warning",
                  )}
                >
                  {failures === 0
                    ? "All contrast checks pass"
                    : `${failures} contrast check${failures === 1 ? "" : "s"} below AA`}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <Link
                    href={routes.dashboardTheme(theme.slug)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-pill bg-primary-soft px-3 text-[0.8125rem] font-semibold text-primary-strong transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Edit colours
                  </Link>
                  {!isActive ? (
                    <button
                      type="button"
                      onClick={() => dispatch(activateTheme(theme.id))}
                      className="inline-flex h-9 shrink-0 items-center rounded-pill border border-border px-3 text-[0.8125rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
                    >
                      Activate
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="new-theme" className="mt-10 max-w-xl">
        <h2 id="new-theme" className="text-lg font-bold text-foreground">
          New theme
        </h2>

        {freeSlot ? (
          <>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Starts as a copy of the live theme, at{" "}
              <code className="font-mono text-xs">/dashboard/themes/{freeSlot}</code>.
            </p>
            <form onSubmit={handleCreate} className="mt-4 flex flex-wrap gap-2">
              <label htmlFor="new-theme-name" className="sr-only">
                Theme name
              </label>
              <input
                id="new-theme-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Monsoon"
                className="h-11 min-w-0 flex-1 rounded-control border border-input bg-card px-4 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-pill bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
              >
                <Plus className="size-4" aria-hidden="true" />
                Create
              </button>
            </form>
          </>
        ) : (
          <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
            All {CUSTOM_THEME_SLUGS.length} custom slots are in use. The site is exported as static
            files, so theme routes have to exist at build time — delete a custom theme to free a
            slot, or add more slugs to <code className="font-mono text-xs">CUSTOM_THEME_SLUGS</code>{" "}
            and rebuild.
          </p>
        )}
      </section>
    </div>
  );
}
