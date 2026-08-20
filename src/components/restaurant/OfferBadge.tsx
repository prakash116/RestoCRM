import { BadgePercent, CreditCard, Gift, Tag } from "lucide-react";

import type { OfferKind, RestaurantOffer } from "@/types/restaurant";
import { cn } from "@/lib/utils/cn";

const offerIcons: Record<OfferKind, typeof Tag> = {
  percentage: BadgePercent,
  flat: Tag,
  combo: Gift,
  bank: CreditCard,
};

/**
 * Offer strip.
 *
 * `overlay` sits on the card image with its own scrim; `inline` is the flat
 * version used in body copy and on the offers tab.
 */
export function OfferBadge({
  offer,
  variant = "inline",
  className,
}: {
  offer: RestaurantOffer;
  variant?: "inline" | "overlay";
  className?: string;
}) {
  const Icon = offerIcons[offer.kind];

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 pb-3 text-white",
          "text-xs font-extrabold tracking-wide",
          className,
        )}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{offer.label}</span>
        <span className="sr-only">offer: {offer.description}</span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-control border border-primary/20 bg-primary-soft px-2 py-1",
        "text-[0.6875rem] font-extrabold tracking-wide text-primary-strong uppercase",
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {offer.label}
    </span>
  );
}
