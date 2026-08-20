"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/**
 * Horizontal scroll rail with desktop arrow controls.
 *
 * Built on native overflow + scroll-snap rather than a carousel library:
 * touch, trackpad, keyboard and screen-reader behaviour all come for free, and
 * the rail costs no extra bundle. The arrows are a pointer-device
 * enhancement — they are hidden from assistive tech because the same content
 * is already reachable by tabbing through the cards.
 */
export function ScrollRail({
  children,
  className,
  itemClassName,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  /** Applied to the scrolling track. */
  itemClassName?: string;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 8);
    // 8px slack absorbs sub-pixel rounding at fractional zoom levels.
    setCanScrollRight(node.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    sync();
    node.addEventListener("scroll", sync, { passive: true });

    // Card widths are responsive, so re-measure when the rail itself resizes.
    const observer = new ResizeObserver(sync);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const node = trackRef.current;
    if (!node) return;
    // Roughly one "page" of cards, capped so wide screens do not overshoot.
    const amount = Math.min(node.clientWidth * 0.8, 720);
    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth",
          // Bleed to the viewport edge on mobile so cards run off-screen the
          // way a native rail does, then re-inset the first/last card.
          "-mx-5 px-5 pt-1 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0",
          itemClassName,
        )}
      >
        {children}
      </div>

      <RailButton
        direction="left"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        className="-left-4"
      />
      <RailButton
        direction="right"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        className="-right-4"
      />
    </div>
  );
}

function RailButton({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-border bg-card text-foreground shadow-lift",
        "transition-[opacity,transform,background-color] duration-200",
        "hover:bg-primary hover:text-primary-foreground",
        "disabled:pointer-events-none disabled:opacity-0",
        "lg:grid",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
