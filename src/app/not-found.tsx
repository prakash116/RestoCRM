import Link from "next/link";
import { Compass, House } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cuisines } from "@/data/cuisines";
import { routes } from "@/lib/utils/routes";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-panel bg-primary-soft">
        <Compass className="size-8 text-primary" aria-hidden="true" />
      </span>

      <p className="mt-6 text-sm font-bold tracking-[0.16em] text-primary uppercase">Error 404</p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
        We could not find that page
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        The restaurant may have been delisted, or the link may be out of date. Start from the city
        listing and find somewhere to eat instead.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={routes.restaurants()} variant="primary" size="lg">
          Browse restaurants
        </Button>
        <Button href={routes.home()} variant="secondary" size="lg">
          <House className="size-4" aria-hidden="true" />
          Back to home
        </Button>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
          Popular in Delhi
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {cuisines.map((cuisine) => (
            <li key={cuisine.id}>
              <Link
                href={routes.cuisine(cuisine.slug)}
                className="inline-flex rounded-pill border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
              >
                {cuisine.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
