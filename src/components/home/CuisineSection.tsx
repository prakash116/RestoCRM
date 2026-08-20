import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLUR_WARM } from "@/data/images";
import { routes } from "@/lib/utils/routes";
import type { Cuisine } from "@/types/restaurant";

/**
 * "Explore by Cuisine".
 *
 * Image-led category tiles. The photograph scales gently on hover while the
 * scrim stays fixed, so the label never loses contrast mid-transition.
 */
export function CuisineSection({ cuisines }: { cuisines: Cuisine[] }) {
  return (
    <section id="cuisines" aria-labelledby="cuisines-heading" className="scroll-mt-24 py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="cuisines-heading"
          eyebrow="Browse"
          title="Explore by Cuisine"
          description="From Old Delhi kebabs to neighbourhood trattorias — start with what you are in the mood for."
        />

        <RevealGroup
          as="ul"
          stagger={0.05}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {cuisines.map((cuisine) => (
            <RevealItem as="li" key={cuisine.id}>
              <Link
                href={routes.cuisine(cuisine.slug)}
                className="group relative block aspect-4/5 overflow-hidden rounded-card bg-muted shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift sm:aspect-square"
              >
                <Image
                  src={cuisine.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30vw, 45vw"
                  placeholder="blur"
                  blurDataURL={BLUR_WARM}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,12,10,0.9)_2%,rgba(18,12,10,0.35)_45%,rgba(18,12,10,0.06)_100%)]"
                />

                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-base leading-tight font-bold text-white sm:text-lg">
                    {cuisine.name}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-white/70">
                    {cuisine.restaurantCount} restaurants
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
