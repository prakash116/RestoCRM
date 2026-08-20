import { DishCard } from "@/components/dish/DishCard";
import { Container } from "@/components/ui/Container";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/utils/routes";
import type { Dish } from "@/types/dish";

/**
 * "Popular Dishes in Delhi".
 *
 * A horizontal rail rather than a grid: dish discovery is browsing, not
 * comparison, and the rail keeps the section short enough that the cuisine and
 * partnership sections stay within reach on a phone.
 */
export function PopularDishes({ dishes }: { dishes: Dish[] }) {
  return (
    <section
      id="popular-dishes"
      aria-labelledby="dishes-heading"
      className="scroll-mt-24 bg-secondary/40 py-16 lg:py-24"
    >
      <Container>
        <SectionHeading
          id="dishes-heading"
          eyebrow="Trending now"
          title="Popular Dishes in Delhi"
          description="The plates the city is ordering most this week, straight from the kitchens serving them."
          action={{ label: "Explore All Dishes", href: routes.dishes() }}
        />

        <ScrollRail ariaLabel="Popular dishes in Delhi" className="mt-8">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="w-[15.5rem] shrink-0 snap-start sm:w-[16.5rem] lg:w-[17.5rem]"
            >
              <DishCard dish={dish} />
            </div>
          ))}
        </ScrollRail>
      </Container>
    </section>
  );
}
