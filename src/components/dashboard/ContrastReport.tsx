"use client";

import { CircleCheck, TriangleAlert } from "lucide-react";

import { evaluateContrast } from "@/lib/theme/contrast";
import type { ThemeColors } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * Live WCAG readout for the palette being edited.
 *
 * The editor lets anyone pick any colour, so contrast has to be measured
 * rather than assumed. Failures are listed first — the point is to catch an
 * unreadable combination while it is still a draft, not after it ships.
 */
export function ContrastReport({ colors }: { colors: ThemeColors }) {
  const results = evaluateContrast(colors);
  const failures = results.filter((result) => !result.passes);
  const ordered = [...failures, ...results.filter((result) => result.passes)];

  return (
    <section aria-labelledby="contrast-heading" className="rounded-card border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 id="contrast-heading" className="text-sm font-bold text-foreground">
          Accessibility
        </h2>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase",
            failures.length === 0
              ? "bg-success-soft text-success"
              : "bg-warning-soft text-warning",
          )}
        >
          {failures.length === 0 ? (
            <CircleCheck className="size-3" aria-hidden="true" />
          ) : (
            <TriangleAlert className="size-3" aria-hidden="true" />
          )}
          {failures.length === 0 ? "All pass" : `${failures.length} below AA`}
        </span>
      </div>

      <ul
        tabIndex={0}
        aria-label="Contrast check results"
        className="max-h-[28rem] divide-y divide-border overflow-y-auto"
      >
        {ordered.map((result) => (
          <li key={result.id} className="flex items-start gap-3 px-4 py-3">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                result.passes ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
              )}
            >
              {result.passes ? (
                <CircleCheck className="size-3.5" aria-hidden="true" />
              ) : (
                <TriangleAlert className="size-3.5" aria-hidden="true" />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{result.label}</span>
              <span className="block text-xs text-muted-foreground">{result.note}</span>
            </span>

            <span className="shrink-0 text-right">
              <span
                className={cn(
                  "block text-sm font-bold tabular-nums",
                  result.passes ? "text-foreground" : "text-warning",
                )}
              >
                {result.ratio ? `${result.ratio.toFixed(2)}:1` : "—"}
              </span>
              <span className="block text-[0.6875rem] text-muted-foreground tabular-nums">
                min {result.min.toFixed(1)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        4.5:1 is the WCAG AA floor for normal text; 3:1 applies to large text and non-text UI such
        as borders and focus rings.
      </p>
    </section>
  );
}
