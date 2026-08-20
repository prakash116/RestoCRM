import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/AuthShell";
import { RestaurantAuthForm } from "@/components/auth/RestaurantAuthForm";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

/** Authenticated surface — excluded from the index and from the sitemap. */
export const metadata: Metadata = buildMetadata({
  title: "Restaurant Login",
  description: "Sign in to the DineBoard restaurant console.",
  path: "/restaurant/login",
  noIndex: true,
});

export default function RestaurantLoginPage() {
  return (
    <AuthShell
      title="Sign in to your console"
      description="Manage your menu, QR codes, offers, bookings and outlet performance."
      highlights={[
        "Update your menu once — every table QR reflects it instantly",
        "See bookings, covers and outlet performance in one dashboard",
        "Segment customers and run WhatsApp and push campaigns",
      ]}
      footer={
        <>
          Not listed yet?{" "}
          <Link
            href={routes.listRestaurant()}
            className="rounded-sm font-semibold text-primary hover:underline"
          >
            List your restaurant
          </Link>
          .
        </>
      }
    >
      <RestaurantAuthForm mode="login" />
    </AuthShell>
  );
}
