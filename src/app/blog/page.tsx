import type { Metadata } from "next";

import { PendingPage } from "@/components/layout/PendingPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "The DineBoard Journal",
  description:
    "Writing on Delhi's restaurants, the people running them, and the technology changing how the city eats.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PendingPage
      eyebrow="Journal"
      title="The DineBoard Journal"
      description="Writing on Delhi's kitchens, the people running them, and what actually moves covers. Publishing alongside the Delhi rollout."
      breadcrumbs={[{ name: "Blog", path: routes.blog() }]}
      covers={[
        "Locality guides — where to eat in Connaught Place, Hauz Khas, Chandni Chowk and beyond",
        "Kitchen interviews with the owners and chefs behind listed restaurants",
        "What the data says: how diners in Delhi search, book and choose",
        "Playbooks for restaurants — pricing menus, running offers and filling quiet nights",
        "Product notes on what we ship and why",
      ]}
      contactEmail="hello@dineboard.in"
      contactLabel="Pitch a story"
    />
  );
}
