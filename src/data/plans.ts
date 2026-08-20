import type { MembershipPlan } from "@/types/membership";

import { routes } from "@/lib/utils/routes";

/**
 * Restaurant technology plans.
 *
 * Commercials are intentionally not hard-coded as numbers — `priceLabel` and
 * `priceNote` are display strings owned by the sales team. When pricing is
 * finalised, edit those two fields; no component changes are required.
 */
export const membershipPlans: MembershipPlan[] = [
  {
    id: "qr-starter",
    name: "QR Starter",
    summary: "Get your restaurant online and taking bookings in a single afternoon.",
    bestFor: "Single-outlet restaurants and cafes going digital for the first time",
    priceLabel: "Starting Plan",
    priceNote: "Talk to sales for launch pricing",
    features: [
      { label: "Dynamic Restaurant QR", group: "QR", available: true },
      { label: "Table QR Codes", group: "QR", available: true },
      { label: "QR Direct Menu Access", group: "QR", available: true },
      { label: "QR Management", group: "QR", available: true },
      { label: "Booking Activation", group: "Bookings", available: true },
      { label: "Basic Restaurant Listing", group: "Discovery", available: true },
    ],
    ctaLabel: "Start With QR",
    ctaHref: routes.listRestaurant(),
    recommended: false,
  },
  {
    id: "digital-presence",
    name: "Digital Presence",
    summary: "A full public storefront that ranks, converts and shows every outlet.",
    bestFor: "Growing restaurants with two or more outlets that want to be found",
    priceLabel: "Contact Sales",
    priceNote: "Billed annually · onboarding included",
    inheritsFrom: "QR Starter",
    features: [
      { label: "Custom Restaurant Landing Page", group: "Storefront", available: true },
      { label: "Restaurant Profile", group: "Storefront", available: true },
      { label: "Menu Showcase", group: "Storefront", available: true },
      { label: "Offers", group: "Storefront", available: true },
      { label: "Customer Ratings", group: "Storefront", available: true },
      { label: "Search Listing", group: "Discovery", available: true },
      { label: "Multiple Outlet Support", group: "Operations", available: true },
      { label: "Basic Analytics", group: "Insights", available: true },
    ],
    ctaLabel: "Contact Sales",
    ctaHref: routes.contact(),
    recommended: true,
  },
  {
    id: "restaurant-pro",
    name: "Restaurant Pro",
    summary: "Customer intelligence, campaigns and multi-outlet operations in one console.",
    bestFor: "Multi-outlet groups running marketing and operations at scale",
    priceLabel: "Contact Sales",
    priceNote: "Custom pricing · dedicated success manager",
    inheritsFrom: "Digital Presence",
    features: [
      { label: "Customer CRM", group: "Customers", available: true },
      { label: "Customer Segmentation", group: "Customers", available: true },
      { label: "Campaign Management", group: "Marketing", available: true },
      { label: "WhatsApp Business API readiness", group: "Marketing", available: true },
      { label: "Push Notifications", group: "Marketing", available: true },
      { label: "In-App Notifications", group: "Marketing", available: true },
      { label: "Employee Management", group: "Team", available: true },
      { label: "Employee Attendance", group: "Team", available: true },
      { label: "Advanced Analytics", group: "Insights", available: true },
      { label: "Restaurant Operations Dashboard", group: "Operations", available: true },
      { label: "Multi-Outlet Management", group: "Operations", available: true },
    ],
    ctaLabel: "Talk to Sales",
    ctaHref: routes.contact(),
    recommended: false,
  },
];
