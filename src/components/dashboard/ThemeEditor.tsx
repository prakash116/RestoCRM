"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, Moon, RotateCcw, Sun, Trash2 } from "lucide-react";

import {
  activateTheme,
  deleteTheme,
  renameTheme,
  resetTheme,
  setThemeColor,
  setThemeMode,
} from "@/lib/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getThemeColors, themeToCss, type ThemeMode } from "@/lib/theme/apply";
import { THEME_TOKEN_GROUPS, tokensByGroup, type ThemeTokenName } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

import { ColorField } from "./ColorField";
import { ContrastReport } from "./ContrastReport";
import { ThemePreview } from "./ThemePreview";

/**
 * Full palette editor for one named theme.
 *
 * Every change writes straight to the store — there is no separate save step,
 * because the store *is* the persisted state and an unsaved draft would be a
 * second source of truth for the same colours. "Activate" is the deliberate
 * action: it decides which theme the public site renders.
 */
export function ThemeEditor({ themeSlug }: { themeSlug: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const theme = useAppSelector((state) =>
    state.theme.themes.find((candidate) => candidate.slug === themeSlug),
  );
  const isActiveTheme = useAppSelector((state) => state.theme.activeThemeId === theme?.id);
  const activeMode = useAppSelector((state) => state.theme.activeMode);
  const hydrated = useAppSelector((state) => state.theme.hydrated);
  const [editingMode, setEditingMode] = useState<ThemeMode | null>(null);
  const selectedMode = editingMode ?? activeMode;
  const [nameDraft, setNameDraft] = useState(theme?.name ?? "");
  const [lastThemeName, setLastThemeName] = useState(theme?.name ?? "");

  const currentThemeName = theme?.name ?? "";
  if (lastThemeName !== currentThemeName) {
    setLastThemeName(currentThemeName);
    setNameDraft(currentThemeName);
  }

  const handleColorChange = useCallback(
    (token: ThemeTokenName, value: string) => {
      if (theme) dispatch(setThemeColor({ themeId: theme.id, mode: selectedMode, token, value }));
    },
    [dispatch, selectedMode, theme],
  );

  const handleCopyCss = useCallback(async () => {
    if (!theme) return;
    try {
      await navigator.clipboard.writeText(themeToCss(theme));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be refused; the CSS stays visible below so it can
      // still be selected by hand.
      setCopied(false);
    }
  }, [theme]);

  if (!hydrated) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading theme…
      </p>
    );
  }

  if (!theme) {
    return (
      <div className="rounded-panel border border-dashed border-border bg-card px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">This theme slot is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Nothing has been created here yet. Start a new theme from the themes list.
        </p>
        <Link
          href={routes.dashboardThemes()}
          className="mt-6 inline-flex h-11 items-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
        >
          Back to themes
        </Link>
      </div>
    );
  }

  const colors = getThemeColors(theme, selectedMode);
  const themeId = theme.id;
  const themeName = theme.name;
  const isLiveVariant = isActiveTheme && activeMode === selectedMode;

  function commitName() {
    const nextName = nameDraft.trim();
    if (nextName) dispatch(renameTheme({ themeId, name: nextName }));
    else setNameDraft(themeName);
  }

  function activateEditedVariant() {
    dispatch(activateTheme(themeId));
    dispatch(setThemeMode(selectedMode));
  }

  return (
    <div>
      <Link
        href={routes.dashboardThemes()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary-strong"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All themes
      </Link>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <label htmlFor="theme-name" className="sr-only">
            Theme name
          </label>
          <input
            id="theme-name"
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            onBlur={commitName}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") {
                setNameDraft(theme.name);
                event.currentTarget.blur();
              }
            }}
            className="w-full max-w-md rounded-control border border-transparent bg-transparent text-2xl font-extrabold tracking-[-0.02em] text-foreground transition-colors hover:border-border focus:border-primary focus:bg-card focus:px-3 focus:py-1 focus:outline-none"
          />
          <p className="mt-1.5 text-sm text-muted-foreground">{theme.description}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            /dashboard/themes/{theme.slug}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isLiveVariant ? (
            <span className="inline-flex h-10 items-center gap-2 rounded-pill bg-success-soft px-4 text-sm font-bold text-success">
              <Check className="size-4" aria-hidden="true" />
              Live · {activeMode}
            </span>
          ) : (
            <button
              type="button"
              onClick={activateEditedVariant}
              className="inline-flex h-10 items-center rounded-pill bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
            >
              Activate {selectedMode}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyCss}
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
          >
            <Copy className="size-4" aria-hidden="true" />
            {copied ? "Both modes copied" : "Copy both modes"}
          </button>

          {theme.builtIn ? (
            <button
              type="button"
              onClick={() => dispatch(resetTheme(theme.id))}
              className="inline-flex h-10 items-center gap-2 rounded-pill border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset both
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Delete ${theme.name}? This removes both Light and Dark variants from this browser.`)) return;
                dispatch(deleteTheme(theme.id));
                router.replace(routes.dashboardThemes());
              }}
              className="inline-flex h-10 items-center gap-2 rounded-pill border border-danger/30 px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Theme CSS copied to the clipboard." : ""}
      </p>

      <section className="mt-7 rounded-card border border-border bg-card p-4 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="text-sm font-extrabold text-foreground">Editing appearance</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Light and Dark are separate, accessible token sets inside this colour combination.
          </p>
        </div>
        <div role="group" aria-label="Palette variant to edit" className="mt-3 inline-grid grid-cols-2 rounded-pill bg-muted p-1 sm:mt-0">
          {(["light", "dark"] as const).map((mode) => {
            const Icon = mode === "light" ? Sun : Moon;
            const selected = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={selected}
                onClick={() => setEditingMode(mode)}
                className={cn(
                  "inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-pill px-4 text-sm font-bold capitalize transition-colors",
                  selected ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {mode}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-8">
          {THEME_TOKEN_GROUPS.map((group) => {
            const tokens = tokensByGroup(group);
            if (tokens.length === 0) return null;

            return (
              <section key={group} aria-labelledby={`group-${group.replace(/\s+/g, "-")}`}>
                <h2
                  id={`group-${group.replace(/\s+/g, "-")}`}
                  className="text-xs font-bold tracking-[0.16em] text-primary-strong uppercase"
                >
                  {group}
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {tokens.map((token) => (
                    <ColorField
                      key={token.name}
                      token={token}
                      value={colors[token.name]}
                      onChange={(next) => handleColorChange(token.name, next)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sticky so the preview and contrast stay in view while scrolling a
            long token list. */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <ThemePreview colors={colors} mode={selectedMode} />
          <ContrastReport colors={colors} />
        </div>
      </div>

      <section aria-labelledby="css-heading" className="mt-10">
        <h2 id="css-heading" className="text-sm font-bold text-foreground">
          Publish this theme
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Edits here are saved to this browser only. The export includes both Light and Dark.
          Replace the matching theme blocks in <code className="font-mono text-xs">src/app/globals.css</code>{" "}
          with the CSS below and redeploy to publish it for every visitor.
        </p>
        <pre className="mt-3 max-h-72 overflow-auto rounded-card border border-border bg-ink p-4 font-mono text-xs leading-relaxed text-ink-foreground">
          <code>{themeToCss(theme)}</code>
        </pre>
      </section>
    </div>
  );
}
