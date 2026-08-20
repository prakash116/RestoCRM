import { Container } from "@/components/ui/Container";
import { FilterChipRowSkeleton, RestaurantCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

/**
 * Streaming fallback for the listing route.
 *
 * `/restaurants` is rendered on demand because it reads `?q=`, so a search
 * from the header has a real wait behind it. The skeleton reserves the exact
 * grid the results land in, which keeps CLS at zero.
 */
export default function RestaurantsLoading() {
  return (
    <>
      <div className="border-b border-border py-10 lg:py-14">
        <Container>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-6 h-11 w-full max-w-xl" />
          <Skeleton className="mt-4 h-5 w-full max-w-md" />
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <FilterChipRowSkeleton />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </div>
      </Container>

      <p className="sr-only" role="status">
        Loading restaurants
      </p>
    </>
  );
}
