import { cn } from "@/lib/utils/cn";

/**
 * Small status pill with an optional live dot.
 *
 * The dot pulses via CSS keyframes only when the user allows motion; the badge
 * never relies on the animation to convey meaning.
 */
export function AnimatedBadge({
  children,
  tone = "brand",
  pulse = false,
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "neutral" | "success" | "inverse";
  pulse?: boolean;
  className?: string;
}) {
  const tones = {
    brand: "border-primary/20 bg-primary-soft text-primary-strong",
    neutral: "border-border bg-muted text-muted-foreground",
    success: "border-success/20 bg-success-soft text-success",
    inverse: "border-white/15 bg-white/10 text-ink-foreground backdrop-blur-sm",
  } as const;

  const dotTones = {
    brand: "bg-primary",
    neutral: "bg-muted-foreground",
    success: "bg-success",
    inverse: "bg-primary-soft",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5",
        "text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {pulse ? (
        <span aria-hidden="true" className="relative flex size-1.5">
          <span
            className={cn(
              "absolute inline-flex size-full rounded-full opacity-70",
              dotTones[tone],
              "motion-safe:animate-ping motion-reduce:hidden",
            )}
          />
          <span className={cn("relative inline-flex size-1.5 rounded-full", dotTones[tone])} />
        </span>
      ) : null}
      {children}
    </span>
  );
}
