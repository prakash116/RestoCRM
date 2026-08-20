import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone, QrCode, Users } from "lucide-react";

import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/utils/cn";
import { formatDistance } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routes";
import type { Outlet, Restaurant } from "@/types/restaurant";

/** Formats the outlet's daily service window, e.g. "12:00 – 23:00". */
function serviceWindow(outlet: Outlet): string {
  const slot = outlet.hours[0];
  return slot ? `${slot.opens} – ${slot.closes}` : "Hours on request";
}

export function OutletCard({
  restaurant,
  outlet,
}: {
  restaurant: Restaurant;
  outlet: Outlet;
}) {
  const href = routes.outlet(restaurant.slug, outlet.slug);

  return (
    <GlowCard as="article" className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.0625rem] leading-snug font-bold text-foreground">
          <Link
            href={href}
            className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {outlet.name}
          </Link>
        </h3>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide uppercase",
            outlet.isOpen ? "bg-success-soft text-success" : "bg-muted text-muted-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              outlet.isOpen ? "bg-success" : "bg-muted-foreground",
            )}
          />
          {outlet.isOpen ? "Open" : "Closed"}
        </span>
      </div>

      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        <li className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary-strong/70" aria-hidden="true" />
          <span>
            {outlet.address}
            <span className="mt-0.5 block text-xs">
              {formatDistance(outlet.location.distanceKm)} away
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <Clock className="size-4 shrink-0 text-primary-strong/70" aria-hidden="true" />
          <span className="tabular-nums">{serviceWindow(outlet)}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <Phone className="size-4 shrink-0 text-primary-strong/70" aria-hidden="true" />
          <span className="tabular-nums">{outlet.phone}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <Users className="size-4 shrink-0 text-primary-strong/70" aria-hidden="true" />
          <span>Seats {outlet.seatingCapacity}</span>
        </li>
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {outlet.qrEnabled ? (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-primary-soft px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-primary-strong uppercase">
            <QrCode className="size-3" aria-hidden="true" />
            QR menu
          </span>
        ) : null}
        {outlet.acceptsBookings ? (
          <span className="inline-flex items-center rounded-pill bg-muted px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-muted-foreground uppercase">
            Bookings
          </span>
        ) : null}

        <span
          aria-hidden="true"
          className="ml-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-primary-strong"
        >
          View outlet
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </GlowCard>
  );
}
