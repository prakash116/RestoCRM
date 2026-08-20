"use client";

import { useSearchParams } from "next/navigation";

import { routes } from "@/lib/utils/routes";
import type { Dish } from "@/types/dish";

import { BookingPanel } from "./BookingPanel";

/** Hydrates optional booking context from a static page's query string. */
export function QueryBookingPanel({
  outletName,
  phone,
  restaurantSlug,
  outletSlug,
  dishes,
}: {
  outletName: string;
  phone: string;
  restaurantSlug: string;
  outletSlug: string;
  dishes: Dish[];
}) {
  const searchParams = useSearchParams();
  const dishId = searchParams.get("dish");
  const selectedDish = dishId ? dishes.find((dish) => dish.id === dishId) : undefined;

  return (
    <BookingPanel
      outletName={outletName}
      phone={phone}
      highlight={searchParams.get("book") === "1"}
      dish={selectedDish}
      clearDishHref={routes.bookTable(restaurantSlug, outletSlug)}
    />
  );
}
