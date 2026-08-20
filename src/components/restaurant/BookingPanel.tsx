"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Info, Phone, Users, X } from "lucide-react";

import { DietMark } from "@/components/restaurant/DietBadges";
import { GlowCard } from "@/components/ui/GlowCard";
import { BLUR_WARM } from "@/data/images";
import { cn } from "@/lib/utils/cn";
import { formatRupees } from "@/lib/utils/format";
import type { Dish } from "@/types/dish";

const TIME_SLOTS = ["12:30", "13:30", "19:00", "20:00", "20:30", "21:30"] as const;
const PARTY_SIZES = [2, 3, 4, 6, 8] as const;

/**
 * Table reservation panel.
 *
 * Slot and party selection are fully interactive so the flow can be
 * demonstrated end to end, but the panel does not pretend to have booked
 * anything: submitting explains that reservations go live once the outlet
 * activates the bookings module, and offers the phone number as the working
 * alternative.
 */
export function BookingPanel({
  outletName,
  phone,
  highlight = false,
  dish,
  clearDishHref,
}: {
  outletName: string;
  phone: string;
  /** True when the visitor arrived via a "Book Table" link (`?book=1`). */
  highlight?: boolean;
  /** Set when the visitor booked from a specific menu row (`?dish=`). */
  dish?: Dish;
  /** Same page without the `dish` param, for the "remove" control. */
  clearDishHref?: string;
}) {
  const [slot, setSlot] = useState<string>(TIME_SLOTS[2]);
  const [party, setParty] = useState<number>(2);
  const [requested, setRequested] = useState(false);
  const noticeId = useId();

  return (
    <GlowCard
      id="book"
      interactive={false}
      className={cn(
        "scroll-mt-28 rounded-panel p-6",
        highlight && "border-primary/40 shadow-lift",
      )}
    >
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-foreground">
        <CalendarCheck className="size-5 text-primary" aria-hidden="true" />
        Book a table
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Reserve at {outletName} — most tables are confirmed in under a minute.
      </p>

      {dish ? (
        <div className="mt-5 flex items-center gap-3 rounded-control border border-primary/25 bg-primary-soft p-2.5">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-control bg-muted">
            <Image
              src={dish.image}
              alt=""
              fill
              sizes="48px"
              placeholder="blur"
              blurDataURL={BLUR_WARM}
              className="object-cover"
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[0.6875rem] font-bold tracking-wide text-primary uppercase">
              Booking for
            </span>
            <span className="mt-0.5 flex items-center gap-1.5">
              <DietMark type={dish.vegType} />
              <span className="truncate text-sm font-bold text-foreground">{dish.name}</span>
            </span>
            <span className="block text-xs font-semibold text-muted-foreground tabular-nums">
              {formatRupees(dish.price)}
            </span>
          </span>

          {clearDishHref ? (
            <Link
              href={clearDishHref}
              aria-label={`Remove ${dish.name} from this booking`}
              className="grid size-8 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <fieldset className="mt-6">
        <legend className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
          Party size
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PARTY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setParty(size)}
              aria-pressed={party === size}
              className={cn(
                "inline-flex h-10 min-w-11 items-center justify-center gap-1.5 rounded-pill border px-3 text-sm font-semibold transition-colors",
                party === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <Users className="size-3.5" aria-hidden="true" />
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
          Time slot
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSlot(time)}
              aria-pressed={slot === time}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-control border text-sm font-semibold tabular-nums transition-colors",
                slot === time
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="mt-6 rounded-control bg-muted px-4 py-3 text-sm text-foreground">
        Table for <strong className="font-bold">{party}</strong> at{" "}
        <strong className="font-bold tabular-nums">{slot}</strong> today
        {dish ? (
          <>
            , with <strong className="font-bold">{dish.name}</strong> noted for the kitchen
          </>
        ) : null}
        .
      </p>

      <button
        type="button"
        onClick={() => setRequested(true)}
        aria-describedby={requested ? noticeId : undefined}
        className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
      >
        Request this table
      </button>

      {requested ? (
        <p
          id={noticeId}
          role="status"
          className="mt-3 flex items-start gap-2.5 rounded-control border border-warning/25 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Online reservations activate once this outlet enables the bookings module. Call the
            outlet directly to confirm a table today.
          </span>
        </p>
      ) : null}

      <a
        href={`tel:${phone.replace(/-/g, "")}`}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill border border-border text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Phone className="size-4" aria-hidden="true" />
        Call {outletName}
      </a>
    </GlowCard>
  );
}
