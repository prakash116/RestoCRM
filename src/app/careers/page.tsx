import type { Metadata } from "next";

import { PendingPage } from "@/components/layout/PendingPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Build the technology layer for Delhi's restaurants. Open roles across engineering, partnerships and restaurant operations.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <PendingPage
      eyebrow="Careers"
      title="Build restaurant technology in Delhi"
      description="We are a small team putting discovery, bookings and operations on one platform for Delhi's restaurants. Roles are posted as the launch team firms up."
      breadcrumbs={[{ name: "Careers", path: routes.careers() }]}
      covers={[
        "Engineering — Next.js and TypeScript across the marketplace and the restaurant console",
        "Restaurant partnerships — onboarding kitchens across Delhi localities",
        "Operations — menu digitisation, QR rollout and outlet training",
        "Product design — the diner-facing marketplace and the owner-facing dashboard",
        "Content — food writing, photography direction and the journal",
      ]}
      contactEmail="careers@dineboard.in"
      contactLabel="Send us your work"
    />
  );
}
