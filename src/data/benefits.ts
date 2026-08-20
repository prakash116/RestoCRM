import {
  LayoutDashboard,
  MessageSquareHeart,
  QrCode,
  Search,
  Store,
  UsersRound,
} from "lucide-react";

import type { BenefitItem } from "@/types/content";

/** "Why restaurants join the platform" — the B2B value proposition. */
export const restaurantBenefits: BenefitItem[] = [
  {
    id: "discovery",
    title: "Get found by diners nearby",
    description:
      "Your restaurant appears in city search, cuisine pages and locality results — with a public page built to rank on Google from day one.",
    icon: Search,
    metric: "SEO-ready pages",
  },
  {
    id: "qr",
    title: "Go digital with a single QR",
    description:
      "One dynamic QR per table opens your live menu instantly. Update prices once and every code in the room reflects it.",
    icon: QrCode,
    metric: "No app install",
  },
  {
    id: "storefront",
    title: "A storefront you actually own",
    description:
      "A branded landing page with your menu, offers, gallery and ratings across every outlet — no marketplace design template.",
    icon: Store,
    metric: "Multi-outlet",
  },
  {
    id: "crm",
    title: "Know who keeps coming back",
    description:
      "Every booking and scan builds a customer profile. Segment by visit frequency, spend and cuisine preference.",
    icon: UsersRound,
    metric: "Built-in CRM",
  },
  {
    id: "campaigns",
    title: "Bring them back without discounts",
    description:
      "Run WhatsApp, push and in-app campaigns to the segments that matter, and measure what each one returned.",
    icon: MessageSquareHeart,
    metric: "Campaign-ready",
  },
  {
    id: "operations",
    title: "Run the floor from one console",
    description:
      "Bookings, staff attendance, outlet performance and menu changes in a single operations dashboard.",
    icon: LayoutDashboard,
    metric: "Live dashboard",
  },
];
