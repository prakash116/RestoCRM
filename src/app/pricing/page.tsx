import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { PricingSection } from "@/components/home/PricingSection";
import { RestaurantBenefits } from "@/components/home/RestaurantBenefits";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Restaurant Membership Plans",
  description:
    "QR Starter, Digital Presence and Restaurant Pro — technology plans for restaurants in Delhi covering QR menus, a public storefront, customer CRM, campaigns and multi-outlet operations.",
  path: "/pricing",
  keywords: [
    "restaurant software India",
    "restaurant QR menu pricing",
    "restaurant CRM Delhi",
    "restaurant management platform",
  ],
});

const faqs = [
  {
    question: "How is pricing decided?",
    answer:
      "Commercials depend on the number of outlets, tables and the modules you switch on. The partnerships team shares a quote after a short call — there is no self-serve checkout during the Delhi launch.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Most single-outlet restaurants are live within a week: menu digitisation, QR printing and listing review usually run in parallel. Multi-outlet groups take longer because each outlet is configured separately.",
  },
  {
    question: "Can we upgrade later?",
    answer:
      "Yes. Plans are cumulative — Digital Presence includes everything in QR Starter, and Restaurant Pro includes everything in Digital Presence. Upgrading keeps your menu, QR codes and ratings intact.",
  },
  {
    question: "Do we keep our own branding?",
    answer:
      "Your restaurant page carries your name, logo, photography and menu. DineBoard handles discovery and the technology underneath it.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="For restaurants"
        title="Grow Your Restaurant With Us"
        description="Choose the technology your restaurant needs today and upgrade as you grow. Every plan is built for restaurants, not for diners."
        breadcrumbs={[{ name: "Membership", path: routes.pricing() }]}
      />

      <PricingSection />

      <Container className="pb-16 lg:pb-24">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
          Questions restaurants ask
        </h2>

        <dl className="mt-8 grid gap-5 lg:grid-cols-2">
          {faqs.map((faq) => (
            <GlowCard key={faq.question} interactive={false} className="rounded-panel p-6">
              <dt className="text-[1.0625rem] font-bold text-foreground">{faq.question}</dt>
              <dd className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </dd>
            </GlowCard>
          ))}
        </dl>

        <p className="mt-8 text-sm text-muted-foreground">
          Still deciding? Write to{" "}
          <a
            href={`mailto:${siteConfig.contact.salesEmail}`}
            className="rounded-sm font-semibold text-primary-strong hover:underline"
          >
            {siteConfig.contact.salesEmail}
          </a>{" "}
          and the partnerships team will walk you through the plans for your outlets.
        </p>
      </Container>

      <RestaurantBenefits />
      <FinalCTA />
    </>
  );
}
