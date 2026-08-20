import type { LucideIcon } from "lucide-react";

export interface CarouselSlide {
  id: string;
  headline: string;
  description: string;
  image: string;
  /** Short kicker above the headline. */
  eyebrow: string;
  ctaLabel: string;
  ctaHref: string;
  /**
   * Tailwind gradient utility applied over the image so the headline keeps
   * AA contrast regardless of the underlying photograph.
   */
  overlayClass: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Optional stat chip rendered inside the card. */
  metric?: string;
}

export interface PartnerBrand {
  id: string;
  name: string;
  /** Two-to-three letter monogram rendered in the placeholder mark. */
  monogram: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface CityOption {
  id: string;
  name: string;
  state: string;
  /** Non-live cities render disabled with a "Coming soon" hint. */
  available: boolean;
  localities: string[];
}
