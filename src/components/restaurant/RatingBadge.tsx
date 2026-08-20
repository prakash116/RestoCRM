import { Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { formatCompactCount, formatRating, ratingTone } from "@/lib/utils/format";

/**
 * Rating chip.
 *
 * Colour bands follow the convention Indian diners already read — green for
 * excellent, amber for good — but the numeric value is always present, so the
 * meaning never depends on colour alone.
 */
export function RatingBadge({
  value,
  count,
  size = "md",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const tone = ratingTone(value);

  const tones = {
    high: "bg-success text-white",
    mid: "bg-star text-ink",
    low: "bg-muted-foreground text-white",
  } as const;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-control font-bold tabular-nums",
          tones[tone],
          size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-[0.8125rem]",
        )}
      >
        <Star
          className={cn("fill-current", size === "sm" ? "size-3" : "size-3.5")}
          aria-hidden="true"
        />
        {formatRating(value)}
      </span>

      {typeof count === "number" ? (
        <span className="text-xs font-medium text-muted-foreground">
          ({formatCompactCount(count)})
        </span>
      ) : null}

      <span className="sr-only">
        Rated {formatRating(value)} out of 5
        {typeof count === "number" ? ` from ${count} reviews` : ""}
      </span>
    </span>
  );
}
