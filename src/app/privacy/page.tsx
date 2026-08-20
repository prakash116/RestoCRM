import type { Metadata } from "next";

import { PendingPage } from "@/components/layout/PendingPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How DineBoard collects, uses and protects diner and restaurant data across the platform.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PendingPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How we handle diner and restaurant data — being finalised with counsel ahead of the Delhi launch."
      breadcrumbs={[{ name: "Privacy", path: routes.privacy() }]}
      covers={[
        "What we collect from diners: search history, favourites, bookings and device data",
        "What restaurants share with us: menus, outlet details, staff records and customer contacts",
        "How QR scans are recorded, and what is stored against a table code",
        "Where data is processed and retained, and how long each category is kept",
        "Your rights under India's Digital Personal Data Protection Act, and how to exercise them",
        "Third-party processors used for payments, messaging and analytics",
      ]}
      contactLabel="Request the privacy draft"
    />
  );
}
