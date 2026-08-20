import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { footerColumns } from "@/data/navigation";
import { siteConfig } from "@/lib/seo/site";

import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./SocialIcons";

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "X", href: siteConfig.social.twitter, Icon: XIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
];

export function Footer() {
  // Rendered on the server: a fixed launch year avoids a hydration mismatch
  // when the server and the visitor's clock disagree across a New Year.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      {/* Extra bottom padding on phones keeps the sticky CTA from covering the
          last row of links — reserved inside the footer so the spacing stays
          the footer's own colour rather than showing a seam beneath it. */}
      <Container className="pt-14 pb-30 md:pb-14 lg:pt-20 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[1.32rem] leading-none font-extrabold tracking-[-0.03em] text-foreground">
                Dine<span className="font-semibold text-primary">Board</span>
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.shortDescription} Built for restaurants that want discovery, bookings and
              operations in one place.
            </p>

            <AnimatedBadge tone="brand" pulse className="mt-5">
              Now live in {siteConfig.launchCity.name}
            </AnimatedBadge>

            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {siteConfig.launchCity.region}, {siteConfig.launchCity.country}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contact.salesEmail}`}
                  className="rounded-sm transition-colors hover:text-primary"
                >
                  {siteConfig.contact.salesEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`}
                  className="rounded-sm transition-colors hover:text-primary"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-foreground uppercase">
                  {column.title}
                </h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">
              © {year} {siteConfig.legalName}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Launching across {siteConfig.launchCity.region} · Restaurant listings shown are
              demonstration data.
            </p>
          </div>

          <ul className="flex items-center gap-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-[1.15rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
