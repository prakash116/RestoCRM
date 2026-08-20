import type { Metadata } from "next";

import { PendingPage } from "@/components/layout/PendingPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms governing use of DineBoard by diners and by restaurants subscribing to the platform.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PendingPage
      eyebrow="Legal"
      title="Terms of Service"
      description="The agreement between DineBoard, diners and restaurant partners — being finalised with counsel ahead of the Delhi launch."
      breadcrumbs={[{ name: "Terms", path: routes.terms() }]}
      covers={[
        "Acceptable use of the marketplace by diners, including reviews and bookings",
        "Restaurant partner obligations: menu accuracy, pricing, offers and food safety compliance",
        "Subscription terms for QR Starter, Digital Presence and Restaurant Pro",
        "Who is responsible when a booking is not honoured, and how disputes are handled",
        "Intellectual property in menus, photography and restaurant branding",
        "Suspension, termination and what happens to your data afterwards",
      ]}
      contactLabel="Request the terms draft"
    />
  );
}
