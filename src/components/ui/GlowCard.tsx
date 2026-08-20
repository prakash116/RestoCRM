import { cn } from "@/lib/utils/cn";

/**
 * Surface primitive used by most content cards.
 *
 * A soft warm glow sits behind the card and deepens on hover. Implemented with
 * a pseudo-free pair of layers and pure CSS transitions — no JavaScript, so it
 * stays a Server Component.
 */
export function GlowCard({
  children,
  className,
  interactive = true,
  id,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Set false for static panels that should not lift on hover. */
  interactive?: boolean;
  /** Anchor target, e.g. deep links from the footer into a pricing plan. */
  id?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Component
      id={id}
      className={cn(
        "group relative isolate overflow-hidden rounded-card border border-border bg-card",
        "shadow-card transition-[transform,box-shadow,border-color] duration-300",
        interactive && "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift",
        className,
      )}
    >
      {/* Brand ambient wash — sits behind content, never intercepts pointers. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-24 -right-16 -z-10 size-56 rounded-full",
          "bg-[radial-gradient(circle,rgb(var(--primary-rgb)/0.16),transparent_68%)] opacity-0 blur-2xl",
          "transition-opacity duration-500",
          interactive && "group-hover:opacity-100",
        )}
      />
      {children}
    </Component>
  );
}
