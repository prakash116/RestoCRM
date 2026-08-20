import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { RestaurantAuthForm } from "@/components/auth/RestaurantAuthForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

export const metadata: Metadata = buildMetadata({
  title: "List Your Restaurant in Delhi",
  description:
    "Get your restaurant discovered across Delhi. Set up QR menus, a public storefront, table bookings and customer CRM with DineBoard — onboarding in under a week.",
  path: "/restaurant/register",
  keywords: [
    "list your restaurant Delhi",
    "restaurant registration India",
    "restaurant partner platform",
  ],
});

export default function RestaurantRegisterPage() {
  return (
    <AuthShell
      title="List your restaurant"
      description="Tell us about your restaurant and the partnerships team will set up your listing, QR codes and menu."
      highlights={[
        "Live on DineBoard search, cuisine and locality pages",
        "Dynamic QR codes for every table, printed and ready",
        "Keep your own branding, photography and menu",
        "Onboarding in under a week for single-outlet restaurants",
      ]}
      footer={
        <>
          Already listed?{" "}
          <Link
            href={routes.restaurantLogin()}
            className="rounded-sm font-semibold text-primary-strong hover:underline"
          >
            Sign in to your console
          </Link>
          . Want to compare plans first?{" "}
          <Link
            href={routes.pricing()}
            className="rounded-sm font-semibold text-primary-strong hover:underline"
          >
            View membership plans
          </Link>
          .
        </>
      }
    >
      <RestaurantAuthForm mode="register" />
    </AuthShell>
  );
}
