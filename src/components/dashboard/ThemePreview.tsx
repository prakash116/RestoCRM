"use client";

import { useLayoutEffect, useRef } from "react";
import { MapPin, Star } from "lucide-react";

import { applyThemeColors } from "@/lib/theme/apply";
import type { ThemeColors } from "@/lib/theme/tokens";

/**
 * Miniature of the real marketplace surfaces, painted with the draft palette.
 *
 * Colours are applied to this subtree's own root rather than to `document`, so
 * a theme can be previewed without taking over the dashboard you are editing
 * it in. Custom properties inherit, so every child picks them up.
 */
export function ThemePreview({ colors }: { colors: ThemeColors }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scopeRef.current) applyThemeColors(colors, scopeRef.current);
  }, [colors]);

  return (
    <section aria-labelledby="preview-heading" className="rounded-card border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 id="preview-heading" className="text-sm font-bold text-foreground">
          Preview
        </h2>
      </div>

      <div ref={scopeRef} className="space-y-4 bg-background p-4">
        {/* Restaurant card */}
        <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
          <div className="flex items-center justify-between gap-2 bg-ink px-3 py-2">
            <span className="text-[0.6875rem] font-bold tracking-wide text-ink-foreground uppercase">
              Open now
            </span>
            <span className="text-[0.6875rem] font-semibold text-ink-muted">20% OFF</span>
          </div>

          <div className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[0.9375rem] font-bold text-foreground">Copper Tandoor</p>
              <span className="inline-flex items-center gap-1 rounded-control bg-success px-1.5 py-0.5 text-xs font-bold text-white">
                <Star className="size-3 fill-current" aria-hidden="true" />
                4.7
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">North Indian • Mughlai</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-primary-strong" aria-hidden="true" />
              Connaught Place
            </p>

            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <span className="inline-flex h-8 flex-1 items-center justify-center rounded-pill bg-primary text-xs font-semibold text-primary-foreground">
                View Restaurant
              </span>
              <span className="inline-flex h-8 items-center justify-center rounded-pill border border-border px-3 text-xs font-semibold text-foreground">
                Book
              </span>
            </div>
          </div>
        </div>

        {/* Chips, badges and diet marks */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-pill bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary-strong">
            Membership
          </span>
          <span className="rounded-pill bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
            Pure Veg
          </span>
          <span className="rounded-pill bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">
            Notice
          </span>
          <span className="grid size-4 place-items-center rounded-[3px] border-[1.5px] border-veg">
            <span className="size-2 rounded-full bg-veg" />
          </span>
          <span className="grid size-4 place-items-center rounded-[3px] border-[1.5px] border-nonveg">
            <span className="size-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-nonveg" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-control bg-star px-1.5 py-0.5 text-xs font-bold text-ink">
            4.2
          </span>
        </div>

        {/* Dark promotional panel */}
        <div className="relative isolate overflow-hidden rounded-card bg-ink p-4">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-6 -z-10 size-32 rounded-full bg-[radial-gradient(circle,rgb(var(--primary-rgb)/0.55),transparent_65%)] blur-2xl"
          />
          <p className="text-[0.6875rem] font-bold tracking-wide text-primary-soft uppercase">
            Reservations
          </p>
          <p className="mt-1.5 text-base font-extrabold text-ink-foreground">Book Your Table</p>
          <p className="mt-1 text-xs text-ink-muted">Skip the waitlist and reserve directly.</p>
        </div>

        <p className="text-xs text-muted-foreground">
          Body copy renders in <span className="text-foreground">foreground</span> over{" "}
          <span className="text-foreground">background</span>.
        </p>
      </div>
    </section>
  );
}
