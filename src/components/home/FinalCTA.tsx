import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";

import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Container } from "@/components/ui/Container";
import { GradientCTA } from "@/components/ui/GradientCTA";
import { Reveal } from "@/components/ui/Reveal";
import { editorialImages } from "@/data/images";
import { routes } from "@/lib/utils/routes";

const assurances = [
  "Onboarding in under a week",
  "No setup fee during the Delhi launch",
  "Keep your own branding",
];

/** Closing conversion panel for restaurant owners. */
export function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-heading" className="pb-16 lg:pb-24">
      <Container>
        <Reveal>
          <GradientCTA image={editorialImages.finalCta} className="px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id="final-cta-heading"
                className="text-balance-tight text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-[3rem]"
              >
                Ready to Digitize Your Restaurant?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Get discovered, manage customers and simplify restaurant operations from one
                platform.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <AnimatedButton href={routes.listRestaurant()} variant="primary" size="lg">
                  List Your Restaurant
                  <ArrowRight className="size-4" aria-hidden="true" />
                </AnimatedButton>

                <Link
                  href={routes.pricing()}
                  className="inline-flex h-13 items-center justify-center rounded-pill border border-white/30 px-7 text-base font-semibold text-ink-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-ink"
                >
                  View Membership Plans
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {assurances.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted"
                  >
                    <CircleCheck className="size-4 shrink-0 text-primary-soft" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </GradientCTA>
        </Reveal>
      </Container>
    </section>
  );
}
