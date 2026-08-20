import Link from "next/link";
import { CircleCheck, Sparkles } from "lucide-react";

import { AnimatedBorderCard } from "@/components/ui/AnimatedBorderCard";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { membershipPlans } from "@/data/plans";
import { cn } from "@/lib/utils/cn";
import type { MembershipPlan } from "@/types/membership";

/**
 * Restaurant technology plans.
 *
 * These are B2B subscriptions for restaurant owners, not a diner loyalty
 * programme. Prices are rendered from `priceLabel` strings in the plan config
 * — no figure is invented here.
 */
export function PricingSection() {
  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="scroll-mt-24 py-16 lg:py-24"
    >
      <Container>
        <SectionHeading
          id="membership-heading"
          eyebrow="Membership"
          title="Grow Your Restaurant With Us"
          description="Choose the technology your restaurant needs today and upgrade as you grow."
          align="center"
        />

        <RevealGroup
          as="ul"
          stagger={0.09}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start"
        >
          {membershipPlans.map((plan) => (
            <RevealItem as="li" key={plan.id} className="h-full">
              <PlanCard plan={plan} />
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          Every plan includes onboarding, menu digitisation and support in English and Hindi.
          Commercials are shared by the partnerships team after a short call about your outlets.
        </p>
      </Container>
    </section>
  );
}

function PlanCard({ plan }: { plan: MembershipPlan }) {
  const body = (
    <div className="flex h-full flex-col p-7 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold tracking-[-0.02em] text-foreground">{plan.name}</h3>
        {plan.recommended ? (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-3 py-1.5 text-[0.6875rem] font-extrabold tracking-wide text-primary-foreground uppercase">
            <Sparkles className="size-3" aria-hidden="true" />
            Most popular
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>

      <div className="mt-6 border-y border-border py-5">
        <p className="text-[1.75rem] leading-none font-extrabold tracking-[-0.025em] text-foreground">
          {plan.priceLabel}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{plan.priceNote}</p>
      </div>

      <p className="mt-5 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
        Best for
      </p>
      <p className="mt-1.5 text-sm text-foreground">{plan.bestFor}</p>

      {plan.inheritsFrom ? (
        <p className="mt-5 rounded-control bg-primary-soft px-3.5 py-2.5 text-sm font-semibold text-primary-strong">
          Everything in {plan.inheritsFrom}, plus:
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2.5">
            <CircleCheck
              className={cn(
                "mt-0.5 size-[1.05rem] shrink-0",
                feature.available ? "text-success" : "text-muted-foreground/50",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-sm leading-snug",
                feature.available ? "text-foreground" : "text-muted-foreground line-through",
              )}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.ctaHref}
        className={cn(
          "mt-8 inline-flex h-12 w-full items-center justify-center rounded-pill px-6 text-[0.9375rem] font-semibold",
          "transition-[background-color,box-shadow,border-color,color] duration-200",
          plan.recommended
            ? "bg-primary text-primary-foreground shadow-soft hover:bg-primary-strong hover:shadow-glow"
            : "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary-strong",
        )}
      >
        {plan.ctaLabel}
        <span className="sr-only"> — {plan.name} plan</span>
      </Link>
    </div>
  );

  if (plan.recommended) {
    return (
      <AnimatedBorderCard id={plan.id} className="h-full scroll-mt-28 lg:-mt-4" innerClassName="h-full">
        {body}
      </AnimatedBorderCard>
    );
  }

  return (
    <GlowCard id={plan.id} interactive={false} className="h-full scroll-mt-28 rounded-panel">
      {body}
    </GlowCard>
  );
}
