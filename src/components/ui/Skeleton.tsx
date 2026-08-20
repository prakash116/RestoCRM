import { cn } from "@/lib/utils/cn";

/** Loading placeholder. Sized by the caller so it reserves real layout space. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("motion-safe:animate-shimmer rounded-control bg-muted", className)}
    />
  );
}

/**
 * Mirrors `RestaurantCard`'s box model exactly — same aspect ratio, same
 * padding, same row heights — so the grid does not shift when the real cards
 * replace it.
 */
export function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-pill" />
          <Skeleton className="h-9 w-24 rounded-pill" />
        </div>
      </div>
    </div>
  );
}

/** Matches `DishCard`. Fills its grid or rail cell rather than fixing a width. */
export function DishCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-card border border-border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

/** Filter chip row placeholder shown above a loading listing. */
export function FilterChipRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-10 w-28 rounded-pill" />
      ))}
    </div>
  );
}
