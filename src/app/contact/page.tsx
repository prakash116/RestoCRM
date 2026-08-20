import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, Headset, Mail, MapPin, Phone, Store } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Contact DineBoard",
  description:
    "Talk to the DineBoard team about listing your restaurant, membership plans, or support for an existing listing in Delhi.",
  path: "/contact",
});

const channels = [
  {
    icon: Handshake,
    title: "Restaurant partnerships",
    body: "Listing a restaurant, comparing plans, or arranging a demo for a multi-outlet group.",
    action: { label: siteConfig.contact.salesEmail, href: `mailto:${siteConfig.contact.salesEmail}` },
  },
  {
    icon: Headset,
    title: "Support",
    body: "Something wrong with a listing, a QR code or a booking — for diners and for partners.",
    action: {
      label: siteConfig.contact.supportEmail,
      href: `mailto:${siteConfig.contact.supportEmail}`,
    },
  },
  {
    icon: Phone,
    title: "Phone",
    body: "Weekdays, 10:00 to 19:00 IST. Fastest route for an outlet that is already live.",
    action: {
      label: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone.replace(/-/g, "")}`,
    },
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the team"
        description="Whether you run one kitchen or twelve outlets, someone on the partnerships team can walk you through what listing on DineBoard involves."
        breadcrumbs={[{ name: "Contact", path: routes.contact() }]}
        actions={
          <Link
            href={routes.listRestaurant()}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
          >
            <Store className="size-4" aria-hidden="true" />
            List Your Restaurant
          </Link>
        }
      />

      <Container className="py-12 lg:py-16">
        <ul className="grid gap-5 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <li key={channel.title}>
                <GlowCard interactive={false} className="h-full rounded-panel p-6">
                  <span className="grid size-11 place-items-center rounded-control bg-primary-soft">
                    <Icon className="size-[1.35rem] text-primary" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-foreground">{channel.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {channel.body}
                  </p>
                  <a
                    href={channel.action.href}
                    className="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:underline"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {channel.action.label}
                  </a>
                </GlowCard>
              </li>
            );
          })}
        </ul>

        <GlowCard interactive={false} className="mt-10 rounded-panel p-6 lg:p-8">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
            <MapPin className="size-5 text-primary" aria-hidden="true" />
            Where we are
          </h2>
          <address className="mt-3 text-base leading-relaxed text-muted-foreground not-italic">
            {siteConfig.legalName}
            <br />
            {siteConfig.launchCity.region}, {siteConfig.launchCity.country}
          </address>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            We are currently onboarding restaurants across {siteConfig.launchCity.name} only.
            Operating in another city and want to be early?{" "}
            <a
              href={`mailto:${siteConfig.contact.salesEmail}`}
              className="rounded-sm font-semibold text-primary hover:underline"
            >
              Tell us where
            </a>
            .
          </p>
        </GlowCard>
      </Container>
    </>
  );
}
