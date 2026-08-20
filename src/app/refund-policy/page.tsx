import type { Metadata } from "next";

import { PendingPage } from "@/components/layout/PendingPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "How refunds and cancellations work for restaurant subscriptions and diner bookings on DineBoard.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <PendingPage
      eyebrow="Legal"
      title="Refund Policy"
      description="How cancellations and refunds work for restaurant subscriptions and diner bookings."
      breadcrumbs={[{ name: "Refund Policy", path: routes.refundPolicy() }]}
      covers={[
        "Cancellation windows for annual and monthly restaurant subscriptions",
        "Pro-rata treatment when a restaurant downgrades between plans mid-term",
        "What happens to prepaid onboarding and QR printing charges",
        "Refunds on booking deposits where an outlet collects one",
        "Timelines for processing refunds back to the original payment method",
        "How to raise a billing dispute and who reviews it",
      ]}
      contactLabel="Request the refund draft"
    />
  );
}
