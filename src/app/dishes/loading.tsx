import { Container } from "@/components/ui/Container";
import { DishCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function DishesLoading() {
  return (
    <>
      <div className="border-b border-border py-10 lg:py-14">
        <Container>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-6 h-11 w-full max-w-lg" />
          <Skeleton className="mt-4 h-5 w-full max-w-md" />
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <DishCardSkeleton key={index} />
          ))}
        </div>
      </Container>

      <p className="sr-only" role="status">
        Loading popular dishes
      </p>
    </>
  );
}
