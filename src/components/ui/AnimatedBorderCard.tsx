import { cn } from "@/lib/utils/cn";

/**
 * Card with a slowly rotating gradient rim.
 *
 * The rim is a single over-sized conic-gradient layer rotated by CSS; the card
 * body sits on top and masks all but a 1px edge. Only the recommended pricing
 * plan uses it — a page full of moving borders reads as a demo, not a product.
 */
export function AnimatedBorderCard({
  children,
  className,
  innerClassName,
  id,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  /** Anchor target, e.g. deep links from the footer into a pricing plan. */
  id?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Component id={id} className={cn("relative isolate rounded-panel p-px", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-panel",
          // Static brand rim; the spin only runs when motion is allowed.
          "bg-[linear-gradient(140deg,var(--primary),rgb(var(--accent-rgb)/0.85),var(--primary))]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 left-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2",
            "bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_70deg,rgb(var(--accent-rgb)/0.9)_140deg,transparent_220deg,transparent_360deg)]",
            "motion-safe:animate-[spin_9s_linear_infinite] motion-reduce:hidden",
          )}
        />
      </span>

      <div className={cn("rounded-[calc(var(--radius-panel)-1px)] bg-card", innerClassName)}>
        {children}
      </div>
    </Component>
  );
}
