import type { Metadata } from "next";
import { QrCode, ScanLine } from "lucide-react";

import { QrRedirect } from "@/components/restaurant/QrRedirect";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getAllQrTokens, resolveQrToken } from "@/data/qr-tokens";
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

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllQrTokens().map((token) => ({ token }));
}

/**
 * QR resolver.
 *
 * Scan → resolve token → restaurant → outlet → table → menu. Known tokens are
 * exported as entry pages and continue to the matching menu after hydration,
 * which keeps the flow usable on a static host such as GitHub Pages.
 */
export default async function QrResolverPage({ params }: QrPageProps) {
  const { token } = await params;
  const resolution = resolveQrToken(token);

  if (resolution) {
    const found = getOutlet(resolution.restaurantSlug, resolution.outletSlug);

    if (found) {
      return (
        <QrRedirect
          href={routes.outletMenu(resolution.restaurantSlug, resolution.outletSlug, {
            table: resolution.tableNumber,
          })}
        />
      );
    }
  }

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-panel bg-primary-soft">
        <ScanLine className="size-8 text-primary-strong" aria-hidden="true" />
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
