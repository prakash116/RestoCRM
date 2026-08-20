"use client";

import { useCallback, useRef } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Card with a spotlight that tracks the cursor.
 *
 * Position is written straight to CSS custom properties on the node inside a
 * `requestAnimationFrame` — routing pointer moves through React state would
 * re-render the subtree on every mouse event. Fine-pointer devices only: the
 * effect is meaningless on touch and the media query keeps it from running.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;

    const { clientX, clientY } = event;
    if (frame.current !== null) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative isolate overflow-hidden rounded-card border border-border bg-card",
        "shadow-card transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300",
          "bg-[radial-gradient(320px_circle_at_var(--spot-x,50%)_var(--spot-y,0px),rgb(var(--primary-rgb)/0.13),transparent_72%)]",
          "motion-safe:group-hover:opacity-100 max-[1023px]:hidden",
        )}
      />
      {children}
    </div>
  );
}
