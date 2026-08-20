"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Toggleable filter pill.
 *
 * Renders as a real `<button>` with `aria-pressed` so the selected state is
 * announced — colour alone would leave screen-reader users guessing.
 */
export function FilterChip({
  label,
  active,
  onClick,
  count,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Optional result count shown alongside the label. */
  count?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-4 py-2 text-sm font-semibold",
        "transition-[background-color,color,border-color,box-shadow] duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground",
        className,
      )}
    >
      {label}
      {typeof count === "number" ? (
        <span
          className={cn(
            "rounded-pill px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums",
            active ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
