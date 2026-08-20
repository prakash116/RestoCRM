import Image from "next/image";
import Link from "next/link";
import { Flame, MapPin } from "lucide-react";

import { DietMark } from "@/components/restaurant/DietBadges";
import { GlowCard } from "@/components/ui/GlowCard";
import { BLUR_WARM } from "@/data/images";
import { cn } from "@/lib/utils/cn";
import { formatRating, formatRupees } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";
import type { Dish } from "@/types/dish";

/**
 * Trending dish card.
 *
 * Links into the owning outlet's menu rather than a standalone dish page —
 * a diner who taps a dish wants to order or book it, and the menu is where
 * both of those happen.
 */
export function DishCard({
  dish,
  showRank = true,
  className,
}: {
  dish: Dish;
  showRank?: boolean;
  className?: string;
}) {
  const href = routes.outletMenu(dish.restaurantSlug, dish.outletSlug);

  return (
    <GlowCard as="article" className={cn("flex h-full flex-col", className)}>
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={dish.image}
          alt={`${dish.name} from ${dish.restaurantName}`}
          fill
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 17rem, 15rem"
          placeholder="blur"
          blurDataURL={BLUR_WARM}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {showRank && dish.rank <= 3 ? (
            <span className="inline-flex items-center gap-1 rounded-pill bg-primary px-2.5 py-1 text-[0.6875rem] font-extrabold tracking-wide text-primary-foreground uppercase shadow-soft">
              <Flame className="size-3" aria-hidden="true" />#{dish.rank} Trending
            </span>
          ) : showRank ? (
            <span className="inline-flex items-center rounded-pill bg-white/90 px-2.5 py-1 text-[0.6875rem] font-extrabold tracking-wide text-ink uppercase backdrop-blur-sm">
              #{dish.rank}
            </span>
          ) : (
            <span />
          )}

          <span className="grid size-7 place-items-center rounded-full bg-white/90 backdrop-blur-sm">
            <DietMark type={dish.vegType} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="text-[0.9375rem] leading-snug font-bold text-foreground">
          <Link
            href={href}
            className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {dish.name}
          </Link>
        </h3>

        <div className="space-y-1">
          <p className="truncate text-sm font-semibold text-muted-foreground">
            {dish.restaurantName}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0 text-primary-strong/70" aria-hidden="true" />
            <span className="truncate">{dish.location}</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="inline-flex items-center gap-1 text-[0.8125rem] font-bold text-foreground">
            <span aria-hidden="true" className="text-star">
              ★
            </span>
            <span className="tabular-nums">{formatRating(dish.rating)}</span>
            <span className="sr-only">out of 5</span>
          </span>
          <span className="text-[0.9375rem] font-extrabold tracking-[-0.01em] text-foreground tabular-nums">
            {formatRupees(dish.price)}
          </span>
        </div>
      </div>
    </GlowCard>
  );
}
