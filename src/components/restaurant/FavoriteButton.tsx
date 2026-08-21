"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";

import { toggleFavorite } from "@/lib/features/favorites/favoritesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/cn";

/**
 * Save-to-favourites toggle.
 *
 * State is read from Redux, which restores from `localStorage` after mount —
 * so the first paint always shows the unsaved state on both server and client
 * and there is no hydration mismatch to reconcile.
 */
export function FavoriteButton({
  restaurantId,
  restaurantName,
  className,
}: {
  restaurantId: string;
  restaurantName: string;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(restaurantId));

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={() => dispatch(toggleFavorite(restaurantId))}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? `Remove ${restaurantName} from favourites` : `Save ${restaurantName} to favourites`
      }
      className={cn(
        "grid size-9 place-items-center rounded-full border border-border bg-card/85 backdrop-blur-sm",
        "shadow-soft transition-colors duration-200 hover:bg-card",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-[1.05rem] transition-colors duration-200",
          // Fill and stroke must be the same step, or the saved heart reads as
          // a two-tone icon.
          isFavorite ? "fill-primary text-primary" : "text-card-foreground/70",
        )}
        aria-hidden="true"
      />
    </motion.button>
  );
}
