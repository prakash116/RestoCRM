/**
 * Every internal URL is built here.
 *
 * Keeping construction centralised means the QR resolution flow
 * (`/q/[token]` → restaurant → outlet → table → menu) and the public
 * discovery flow can evolve independently of the components that link into
 * them. No component should ever concatenate a route string by hand.
 */

export interface RestaurantListQuery {
  cuisine?: string;
  diet?: "veg" | "non-veg";
  q?: string;
  locality?: string;
}

function withQuery(path: string, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export const routes = {
  home: () => "/",

  /* ---- Discovery -------------------------------------------------------- */

  restaurants: (query: RestaurantListQuery = {}) =>
    withQuery("/restaurants", {
      cuisine: query.cuisine,
      diet: query.diet,
      q: query.q,
      locality: query.locality,
    }),

  restaurant: (restaurantSlug: string) => `/restaurants/${restaurantSlug}`,

  outlet: (restaurantSlug: string, outletSlug: string) =>
    `/restaurants/${restaurantSlug}/${outletSlug}`,

  /**
   * `table` is set only when the diner arrived by scanning a table QR — it
   * lets the menu greet them with their table number and, later, attach an
   * order to it.
   */
  outletMenu: (restaurantSlug: string, outletSlug: string, options: { table?: number } = {}) =>
    withQuery(`/restaurants/${restaurantSlug}/${outletSlug}/menu`, {
      table: options.table ? String(options.table) : undefined,
    }),

  outletOffers: (restaurantSlug: string, outletSlug: string) =>
    `/restaurants/${restaurantSlug}/${outletSlug}/offers`,

  outletReviews: (restaurantSlug: string, outletSlug: string) =>
    `/restaurants/${restaurantSlug}/${outletSlug}/reviews`,

  /**
   * Booking is an outlet-level action. Until the reservation service ships,
   * this deep-links to the outlet page with the booking panel requested.
   *
   * `dish` carries the dish a diner booked *from* — tapping "Book" on a menu
   * row has to arrive somewhere that names the dish, otherwise the request is
   * indistinguishable from a plain table booking.
   */
  bookTable: (
    restaurantSlug: string,
    outletSlug: string,
    options: { dish?: string } = {},
  ) =>
    withQuery(`/restaurants/${restaurantSlug}/${outletSlug}`, {
      book: "1",
      dish: options.dish,
    }),

  dishes: (query: { cuisine?: string; q?: string } = {}) =>
    withQuery("/dishes", { cuisine: query.cuisine, q: query.q }),

  cuisine: (slug: string) => `/cuisines/${slug}`,

  search: (q: string) => withQuery("/restaurants", { q }),

  /* ---- Commerce & onboarding ------------------------------------------- */

  pricing: () => "/pricing",
  listRestaurant: () => "/restaurant/register",
  restaurantLogin: () => "/restaurant/login",

  /* ---- QR entry point --------------------------------------------------- */

  /**
   * Single scannable entry point. The token encodes restaurant + outlet and,
   * for table QRs, the table itself; the route handler resolves it server-side
   * and forwards the diner straight to the menu.
   */
  qr: (token: string) => `/q/${token}`,

  /* ---- Marketing -------------------------------------------------------- */

  offers: () => "/restaurants?offers=1",
  about: () => "/about",
  contact: () => "/contact",
  careers: () => "/careers",
  blog: () => "/blog",
  privacy: () => "/privacy",
  terms: () => "/terms",
  refundPolicy: () => "/refund-policy",
} as const;
