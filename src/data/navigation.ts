import type { NavItem } from "@/types/content";

import { routes } from "@/lib/utils/routes";

/**
 * Header navigation.
 *
 * Deliberately three items. "Popular Dishes" and "Partner With Us" were cut:
 * five two-word labels plus search, location, login and the primary CTA
 * overflowed the row and wrapped the links onto two lines.
 *
 * Neither destination is lost — dishes stay reachable from the homepage
 * section and the footer, and "Partner With Us" pointed at the same place as
 * the "List Your Restaurant" button already sitting in the header.
 */
export const primaryNav: NavItem[] = [
  { label: "Restaurants", href: routes.restaurants(), description: "Browse every listing in Delhi" },
  { label: "Offers", href: routes.offers(), description: "Live deals and bank offers" },
  { label: "Membership", href: routes.pricing(), description: "Technology plans for restaurants" },
];

/**
 * Mobile drawer navigation.
 *
 * The drawer is a vertical list with room to spare, so it keeps the two
 * entries the header row cannot fit rather than hiding them from phone users.
 */
export const mobileNav: NavItem[] = [
  { label: "Restaurants", href: routes.restaurants(), description: "Browse every listing in Delhi" },
  { label: "Popular Dishes", href: routes.dishes(), description: "What the city is ordering" },
  { label: "Offers", href: routes.offers(), description: "Live deals and bank offers" },
  { label: "Membership", href: routes.pricing(), description: "Technology plans for restaurants" },
];

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Restaurants", href: routes.restaurants() },
      { label: "Popular Dishes", href: routes.dishes() },
      { label: "Offers", href: routes.offers() },
      { label: "Membership", href: routes.pricing() },
    ],
  },
  {
    title: "For Restaurants",
    links: [
      { label: "List Restaurant", href: routes.listRestaurant() },
      { label: "Restaurant Login", href: routes.restaurantLogin() },
      { label: "QR Solutions", href: `${routes.pricing()}#qr-starter` },
      { label: "CRM", href: `${routes.pricing()}#restaurant-pro` },
      { label: "Employee Management", href: `${routes.pricing()}#restaurant-pro` },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: routes.about() },
      { label: "Contact", href: routes.contact() },
      { label: "Careers", href: routes.careers() },
      { label: "Blog", href: routes.blog() },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: routes.privacy() },
      { label: "Terms", href: routes.terms() },
      { label: "Refund Policy", href: routes.refundPolicy() },
    ],
  },
];
