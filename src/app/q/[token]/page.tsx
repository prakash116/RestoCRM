import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { QrCode, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { resolveQrToken } from "@/data/qr-tokens";
import { getOutlet } from "@/data/restaurants";
import { buildMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/utils/routes";

interface QrPageProps {
  params: Promise<{ token: string }>;
}

/**
 * QR codes are single-use entry points, not content. They are kept out of the
 * index so the same menu is not discoverable under dozens of token URLs.
 */
export const metadata: Metadata = buildMetadata({
  title: "Opening menu",
  description: "Resolving your QR code.",
  path: "/q",
  noIndex: true,
});

/**
 * QR resolver.
 *
 * Scan → resolve token → restaurant → outlet → table → menu, all on the
 * server, so the diner goes from camera to menu in one navigation with no
 * client-side round trip. An unknown token falls through to a helpful screen
 * rather than a bare 404 — a code that has been reprinted or rotated is a
 * routine situation at a busy table, not an error.
 */
export default async function QrResolverPage({ params }: QrPageProps) {
  const { token } = await params;
  const resolution = resolveQrToken(token);

  if (resolution) {
    const found = getOutlet(resolution.restaurantSlug, resolution.outletSlug);

    if (found) {
      redirect(
        routes.outletMenu(resolution.restaurantSlug, resolution.outletSlug, {
          table: resolution.tableNumber,
        }),
      );
    }
  }

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-panel bg-primary-soft">
        <ScanLine className="size-8 text-primary" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
        This code is no longer active
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        The QR you scanned does not point to a live outlet. Restaurants rotate codes when tables
        move or a menu is retired — ask a member of staff for the current code, or find the
        restaurant below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href={routes.restaurants()} variant="primary" size="lg">
          <QrCode className="size-4" aria-hidden="true" />
          Find the restaurant
        </Button>
        <Button href={routes.home()} variant="secondary" size="lg">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
