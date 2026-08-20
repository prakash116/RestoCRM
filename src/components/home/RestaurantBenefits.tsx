import Link from "next/link";
import { ArrowRight, QrCode, ScanLine, Store, UtensilsCrossed } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { restaurantBenefits } from "@/data/benefits";
import { DEMO_QR_TOKEN } from "@/data/qr-tokens";
import { routes } from "@/lib/utils/routes";

/**
 * "Why restaurants join the platform" — the B2B half of the marketplace.
 *
 * Ends with the QR journey, because the scan-to-menu flow is the single
 * clearest demonstration of what a restaurant gets on day one.
 */
export function RestaurantBenefits() {
  return (
    <section
      id="partner"
      aria-labelledby="benefits-heading"
      className="scroll-mt-24 bg-secondary/40 py-16 lg:py-24"
    >
      <Container>
        <SectionHeading
          id="benefits-heading"
          eyebrow="For restaurants"
          title="Why Restaurants Join the Platform"
          description="Discovery, bookings, customer data and daily operations — without stitching together five different tools."
          action={{ label: "Partner With Us", href: routes.listRestaurant() }}
        />

        <RevealGroup
          as="ul"
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {restaurantBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <RevealItem as="li" key={benefit.id} className="h-full">
                <SpotlightCard className="flex h-full flex-col p-6">
                  <span className="grid size-11 place-items-center rounded-control bg-primary-soft">
                    <Icon className="size-[1.35rem] text-primary" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-lg leading-snug font-bold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>

                  {benefit.metric ? (
                    <span className="mt-5 inline-flex w-fit items-center rounded-pill border border-border bg-muted px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {benefit.metric}
                    </span>
                  ) : null}
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <QrJourney />
      </Container>
    </section>
  );
}

const qrSteps = [
  {
    icon: ScanLine,
    title: "Diner scans",
    description: "One code on the table, poster or bill.",
  },
  {
    icon: QrCode,
    title: "Token resolves",
    description: "The link identifies restaurant, outlet and table.",
  },
  {
    icon: Store,
    title: "Outlet opens",
    description: "The right branch, with its own prices and timings.",
  },
  {
    icon: UtensilsCrossed,
    title: "Menu is live",
    description: "Straight to the menu — no app, no download.",
  },
];

function QrJourney() {
  return (
    <Reveal className="mt-14">
      <div className="relative isolate overflow-hidden rounded-panel bg-ink px-6 py-10 text-ink-foreground sm:px-10 lg:px-12 lg:py-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-16 -z-10 size-80 rounded-full bg-[radial-gradient(circle,rgba(214,58,40,0.45),transparent_68%)] blur-3xl"
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-[0.16em] text-primary-soft uppercase">
              QR to table, in one scan
            </p>
            <h3 className="mt-3 text-2xl leading-tight font-extrabold tracking-[-0.025em] sm:text-3xl">
              Your menu, one scan away
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              Every table gets a dynamic code. Update a price once and every code in the room shows
              it — no reprinting, no app install, no waiting for a server.
            </p>
          </div>

          <Link
            href={routes.qr(DEMO_QR_TOKEN)}
            className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-pill border border-white/25 px-5 text-[0.9375rem] font-semibold text-ink-foreground transition-colors hover:bg-white hover:text-ink"
          >
            Try a demo scan
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {qrSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="relative rounded-card border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-primary/20">
                    <Icon className="size-[1.1rem] text-primary-soft" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <p className="mt-4 text-[0.9375rem] font-bold">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
}
