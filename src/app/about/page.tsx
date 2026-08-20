import type { Metadata } from "next";
import Image from "next/image";

import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { BLUR_WARM, editorialImages } from "@/data/images";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "About DineBoard",
  description:
    "DineBoard is a restaurant marketplace and technology platform launching in Delhi — helping diners discover great food and restaurants run discovery, bookings and operations from one place.",
  path: "/about",
});

const principles = [
  {
    title: "Restaurants first",
    body: "A listing that a restaurant cannot control is a liability. Every partner keeps their own branding, photography and menu — we handle discovery and the software underneath it.",
  },
  {
    title: "One system, not five tools",
    body: "Most restaurants run a QR menu from one vendor, bookings from another and customer data in a notebook. Putting them in one console is the entire point of the platform.",
  },
  {
    title: "Delhi before everywhere",
    body: "We would rather cover 24 Delhi localities properly than list half of India badly. Depth in one city is what makes discovery genuinely useful.",
  },
  {
    title: "Honest listings",
    body: "Ratings come from diners, offers come from restaurants, and neither is bought. If a restaurant is closed, the card says closed.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Restaurant technology, built for how Delhi eats"
        description={`${siteConfig.name} is a marketplace for diners and an operating system for restaurants — discovery, table bookings, QR menus, customer data and daily operations in one platform.`}
        breadcrumbs={[{ name: "About", path: routes.about() }]}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-foreground">
              Two audiences, one platform
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Diners come to {siteConfig.name} to find somewhere to eat — by cuisine, by locality,
                by what is trending this week — and to book a table without a phone call. That side
                of the product looks like a marketplace, and it is judged on whether the
                recommendations are any good.
              </p>
              <p>
                Restaurants come for the other half: a public page that ranks, dynamic QR menus on
                every table, a customer database that actually fills up, and campaigns that bring
                people back. That side looks like software, and it is judged on whether covers go
                up.
              </p>
              <p>
                Both halves feed each other. Every scan and booking makes discovery sharper, and
                sharper discovery sends more people through the door. Building only one half is why
                most restaurant tools stall.
              </p>
            </div>
          </div>

          <div className="relative aspect-4/5 overflow-hidden rounded-panel bg-muted lg:aspect-auto">
            <Image
              src={editorialImages.partnerKitchen}
              alt="A restaurant kitchen service in progress"
              fill
              sizes="(min-width: 1024px) 26rem, 92vw"
              placeholder="blur"
              blurDataURL={BLUR_WARM}
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="mt-16 text-2xl font-extrabold tracking-[-0.02em] text-foreground">
          How we work
        </h2>

        <RevealGroup as="ul" className="mt-8 grid gap-5 sm:grid-cols-2">
          {principles.map((principle) => (
            <RevealItem as="li" key={principle.title} className="h-full">
              <GlowCard interactive={false} className="h-full rounded-panel p-6">
                <h3 className="text-lg font-bold text-foreground">{principle.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </GlowCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-10 rounded-panel border border-border bg-muted/50 px-6 py-5 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-foreground">A note on this build:</strong> the
          restaurants, dishes, ratings and partner brands shown across this site are demonstration
          data created for the {siteConfig.launchCity.region} launch build. No real restaurant is
          represented, and no partnership is implied.
        </p>
      </Container>

      <FinalCTA />
    </>
  );
}
