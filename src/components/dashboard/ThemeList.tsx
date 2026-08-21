"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  CircleCheck,
  Copy,
  Moon,
  Paintbrush,
  Plus,
  Sparkles,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { motion } from "motion/react";

import { CUSTOM_THEME_SLUGS } from "@/data/themes";
import { activateTheme, createTheme, setThemeMode } from "@/lib/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { countContrastFailures } from "@/lib/theme/contrast";
import { getThemeColors, themeToCss, type ThemeMode } from "@/lib/theme/apply";
import type { ThemeColors } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

import { ThemePreview } from "./ThemePreview";

const SWATCH_TOKENS = ["primary", "accent", "primary-soft", "card", "background"] as const;

function ThemeSwatches({ colors, compact = false }: { colors: ThemeColors; compact?: boolean }) {
  return (
    <span className="flex items-center" aria-hidden="true">
      {SWATCH_TOKENS.map((token, index) => (
        <span
          key={token}
          style={{ backgroundColor: colors[token] }}
          className={cn(
            "rounded-full border-2 border-card shadow-sm",
            compact ? "size-5" : "size-7",
            index > 0 && (compact ? "-ml-1.5" : "-ml-2"),
          )}
        />
      ))}
    </span>
  );
}

function AppearanceSwitch({ mode, onChange }: { mode: ThemeMode; onChange: (mode: ThemeMode) => void }) {
  const options = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
  ];

  return (
    <div
      role="group"
      aria-label="Interface appearance"
      className="inline-grid grid-cols-2 rounded-pill border border-white/10 bg-white/10 p-1"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const selected = mode === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative isolate inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-pill px-4 text-sm font-bold transition-colors",
              selected ? "text-ink" : "text-ink-muted hover:text-ink-foreground",
            )}
          >
            {selected ? (
              <motion.span
                layoutId="active-appearance"
                className="absolute inset-0 -z-10 rounded-pill bg-ink-foreground shadow-soft"
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}
            <Icon className="size-4" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ThemeList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { themes, activeThemeId, activeMode, hydrated } = useAppSelector((state) => state.theme);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const activeTheme = themes.find((theme) => theme.id === activeThemeId) ?? themes[0];
  const colors = activeTheme ? getThemeColors(activeTheme, activeMode) : null;
  const failures = colors ? countContrastFailures(colors) : 0;
  const usedSlugs = new Set(themes.map((theme) => theme.slug));
  const freeSlot = CUSTOM_THEME_SLUGS.find((slug) => !usedSlugs.has(slug));

  function handleModeChange(mode: ThemeMode) {
    dispatch(setThemeMode(mode));
    setAnnouncement(`${activeTheme?.name ?? "Selected"} ${mode} appearance is now active.`);
  }

  function handlePaletteChange(themeId: string) {
    const theme = themes.find((candidate) => candidate.id === themeId);
    dispatch(activateTheme(themeId));
    setAnnouncement(`${theme?.name ?? "Selected"} ${activeMode} appearance is now active.`);
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!freeSlot) return;
    dispatch(createTheme({ name, seedFromThemeId: activeThemeId }));
    setName("");
    router.push(routes.dashboardTheme(freeSlot));
  }

  async function handleCopyCss() {
    if (!activeTheme) return;
    try {
      await navigator.clipboard.writeText(themeToCss(activeTheme));
      setCopied(true);
      setAnnouncement(`${activeTheme.name} Light and Dark CSS copied to the clipboard.`);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setAnnouncement("Clipboard access is unavailable. Open the palette editor to copy the CSS manually.");
    }
  }

  if (!hydrated || !activeTheme || !colors) {
    return (
      <div role="status" className="rounded-panel border border-border bg-card p-8 text-sm text-muted-foreground shadow-card">
        Preparing the Theme Studio…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[94rem]">
      <header className="relative isolate overflow-hidden rounded-panel bg-ink px-5 py-6 text-ink-foreground shadow-lift sm:px-7 sm:py-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 -z-10 size-80 rounded-full bg-[radial-gradient(circle,rgb(var(--primary-rgb)/0.52),transparent_68%)] blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-rgb)/0.22),transparent_68%)] blur-3xl"
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-primary-soft uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              Appearance studio
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-ink-foreground sm:text-4xl">
              Make DineBoard feel like your brand.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              Choose a colour combination, then move between a polished Light workspace and a focused Dark workspace. Both variants stay paired and ready to publish.
            </p>
          </div>

          <div className="shrink-0">
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">Appearance</p>
            <AppearanceSwitch mode={activeMode} onChange={handleModeChange} />
          </div>
        </div>
      </header>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-card p-4 shadow-soft">
          <dt className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">Live combination</dt>
          <dd className="mt-2 flex items-center gap-3 text-base font-extrabold text-foreground">
            <ThemeSwatches colors={colors} compact />
            {activeTheme.name}
          </dd>
        </div>
        <div className="rounded-card border border-border bg-card p-4 shadow-soft">
          <dt className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">Appearance</dt>
          <dd className="mt-2 flex items-center gap-2 text-base font-extrabold text-foreground capitalize">
            {activeMode === "dark" ? <Moon className="size-4 text-primary-strong" aria-hidden="true" /> : <Sun className="size-4 text-primary-strong" aria-hidden="true" />}
            {activeMode} mode
          </dd>
        </div>
        <div className="rounded-card border border-border bg-card p-4 shadow-soft">
          <dt className="text-[0.6875rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">Accessibility</dt>
          <dd className={cn("mt-2 flex items-center gap-2 text-base font-extrabold", failures === 0 ? "text-success" : "text-warning")}>
            {failures === 0 ? <CircleCheck className="size-4" aria-hidden="true" /> : <TriangleAlert className="size-4" aria-hidden="true" />}
            {failures === 0 ? "All checks pass" : `${failures} below AA`}
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          <ThemePreview colors={colors} mode={activeMode} />

          <section aria-labelledby="palette-anatomy" className="rounded-panel border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-primary-strong uppercase">Current palette</p>
                <h2 id="palette-anatomy" className="mt-1 text-xl font-extrabold text-foreground">{activeTheme.name} · <span className="capitalize">{activeMode}</span></h2>
                <p className="mt-1 text-sm text-muted-foreground">{activeTheme.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyCss}
                  className="inline-flex h-10 items-center gap-2 rounded-pill border border-border px-4 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  {copied ? "Copied both modes" : "Copy theme CSS"}
                </button>
                <Link
                  href={routes.dashboardTheme(activeTheme.slug)}
                  className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-strong"
                >
                  <Paintbrush className="size-4" aria-hidden="true" />
                  Customize
                </Link>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {([
                ["Primary", "primary"],
                ["Accent", "accent"],
                ["Background", "background"],
                ["Card", "card"],
                ["Text", "foreground"],
                ["Muted", "muted"],
              ] as const).map(([label, token]) => (
                <div key={token} className="rounded-control border border-border bg-muted/40 p-3">
                  <span className="block h-9 rounded-md border border-border" style={{ backgroundColor: colors[token] }} aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold text-foreground">{label}</p>
                  <code className="mt-0.5 block text-[0.625rem] text-muted-foreground uppercase">{colors[token]}</code>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-panel border border-border bg-card p-4 shadow-card sm:p-5 xl:sticky xl:top-6 xl:self-start">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-primary-strong uppercase">Brand library</p>
              <h2 className="mt-1 text-lg font-extrabold text-foreground">Colour combinations</h2>
            </div>
            <span className="rounded-pill bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">{themes.length}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Switch instantly. Every combination includes a Light and Dark variant.</p>

          <fieldset className="mt-4">
            <legend className="sr-only">Choose the live colour combination</legend>
            <ul className="scrollbar-none grid auto-cols-[minmax(15rem,78vw)] grid-flow-col gap-3 overflow-x-auto snap-x snap-mandatory pb-2 xl:auto-cols-auto xl:grid-flow-row xl:overflow-visible xl:pb-0">
              {themes.map((theme) => {
                const palette = getThemeColors(theme, activeMode);
                const paletteFailures = countContrastFailures(palette);
                const selected = theme.id === activeThemeId;

                return (
                  <li key={theme.id} className="relative snap-start">
                    <label className="block cursor-pointer">
                      <input
                        type="radio"
                        name="live-theme"
                        value={theme.id}
                        checked={selected}
                        onChange={() => handlePaletteChange(theme.id)}
                        className="peer sr-only"
                      />
                      <span className={cn(
                        "block rounded-card border p-4 pr-12 transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:shadow-soft peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card",
                        selected ? "border-primary bg-primary-soft/60" : "border-border bg-card hover:border-primary/35",
                      )}>
                        <span className="flex items-center justify-between gap-2">
                          <ThemeSwatches colors={palette} compact />
                          {selected ? <Check className="size-4 text-primary-strong" aria-hidden="true" /> : null}
                        </span>
                        <span className="mt-3 block text-sm font-extrabold text-foreground">{theme.name}</span>
                        <span className={cn("mt-1 block text-xs font-semibold capitalize", paletteFailures === 0 ? "text-success" : "text-warning")}>
                          {selected ? `Active · ${activeMode}` : paletteFailures === 0 ? "Contrast ready" : `${paletteFailures} checks need attention`}
                        </span>
                      </span>
                    </label>
                    <Link
                      href={routes.dashboardTheme(theme.slug)}
                      aria-label={`Customize ${theme.name}`}
                      title={`Customize ${theme.name}`}
                      className="absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-primary-strong"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-5 border-t border-border pt-5">
            <h3 className="text-sm font-extrabold text-foreground">Create a combination</h3>
            {freeSlot ? (
              <form onSubmit={handleCreate} className="mt-3 space-y-2.5">
                <label htmlFor="new-theme-name" className="sr-only">New combination name</label>
                <input
                  id="new-theme-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Monsoon"
                  className="h-11 w-full rounded-control border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
                />
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-primary-soft px-4 text-sm font-bold text-primary-strong transition-colors hover:bg-primary hover:text-primary-foreground">
                  <Plus className="size-4" aria-hidden="true" />
                  Create from {activeTheme.name}
                </button>
              </form>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">All custom palette slots are in use. Delete one in its editor to create another.</p>
            )}
          </div>
        </aside>
      </div>

      <p aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}
