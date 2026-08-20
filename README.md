# RestoCRM

The customer-facing product in this repository is branded **DineBoard**.

A public marketplace for a multi-tenant restaurant technology platform, launching in **Delhi, India**.

The site serves two audiences from one domain:

- **Diners** — discover restaurants, dishes, offers and ratings, and book a table.
- **Restaurant owners** — list a restaurant and buy the technology plan that fits it (QR menus, a public storefront, CRM, campaigns, multi-outlet operations).

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script              | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                             |
| `npm run build`     | Production build                                   |
| `npm start`         | Serve the production build                         |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run lint`      | ESLint (Next 16 removed `next lint`)               |
| `npm run check`     | Typecheck + lint together                          |

### Environment

| Variable               | Default                    | Notes                                                   |
| ---------------------- | -------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.dineboard.in` | Drives canonical URLs, `metadataBase`, sitemap, JSON-LD. |

Set this per environment — canonical tags pointing at the wrong host is the
single most common way to lose search rankings on a preview deploy.

### GitHub Pages

Pushes to `main` are verified, statically exported, and deployed by
`.github/workflows/deploy-pages.yml`.

Live site: <https://prakash116.github.io/RestoCRM/>

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Redux Toolkit · Motion for React · Embla Carousel · Three.js (lazy, optional) ·
lucide-react.

Rendering is Server Components by default. Only six things hydrate: the search
field, the header search overlay, the mobile drawer, the promo carousel, the
restaurant filter chips, and the hero's floating cards.

---

## Structure

```
src/
  app/                        routes, metadata, robots, sitemap, manifest, OG image
  components/
    layout/                   Header, Footer, nav, breadcrumbs, page headers
    home/                     one file per homepage section
    restaurant/               RestaurantCard, RatingBadge, OfferBadge, outlet UI
    dish/                     DishCard
    auth/                     restaurant console entry points
    ui/                       design-system primitives
  data/                       all mock data — no records live in components
  lib/
    features/                 Redux slices (location, restaurants, favorites)
    seo/                      site config, metadata builder, JSON-LD
    utils/                    cn, formatters, route builders, motion tokens
  types/                      Restaurant, Outlet, Dish, Cuisine, MembershipPlan…
```

**Data never lives in a component.** Every restaurant, dish, cuisine, plan and
slide comes from `src/data/`. Swapping the mock modules for API calls should not
require touching a single presentational file.

---

## Design tokens

All brand values are CSS custom properties on `:root` in `src/app/globals.css`,
re-exported into Tailwind through `@theme inline`. To re-skin the platform,
change the values in `:root` — nothing else.

```css
--background  --foreground  --card
--primary  --primary-foreground  --primary-strong  --primary-soft
--secondary  --muted  --border  --input  --ring
--success  --warning  --danger
--veg  --nonveg  --star        /* Indian diet marks + review stars */
--ink  --ink-foreground        /* dark promotional panels */
--radius
```

---

## Routing

```
/                                                     homepage
/restaurants                                          listing (?q=, ?offers=1, ?locality=)
/restaurants/[restaurantSlug]                         restaurant landing page
/restaurants/[restaurantSlug]/[outletSlug]            outlet (+ ?book=1)
/restaurants/[restaurantSlug]/[outletSlug]/menu       menu (+ ?table=N from a QR scan)
/restaurants/[restaurantSlug]/[outletSlug]/offers
/restaurants/[restaurantSlug]/[outletSlug]/reviews
/dishes                                               trending dishes
/cuisines/[slug]                                      cuisine landing page
/pricing                                              restaurant membership plans
/q/[token]                                            QR resolver (noindex, redirects)
/restaurant/login  /restaurant/register               restaurant console
```

URLs are **never** concatenated by hand. Every link is built through
`src/lib/utils/routes.ts`, so the QR flow and the discovery flow can evolve
independently.

### QR behaviour

```
scan → /q/[token] → resolve restaurant → resolve outlet → resolve table
     → client redirect → /restaurants/{r}/{o}/menu?table=N
```

Known demo tokens are prerendered as lightweight entry pages, so the diner goes
from camera to menu without a data fetch. Tokens are opaque and resolve through
`src/data/qr-tokens.ts` — replace `resolveQrToken()` with the QR service and
nothing else changes. Demo tokens: `ct-cp-t12`, `mfr-gp-t04`, `ut-np-t07`,
`tn-hk-venue`.

---

## SEO

- `metadata` / `generateMetadata` on every route, via one `buildMetadata()` helper.
- Canonical URLs, Open Graph, Twitter cards, per-route `robots`.
- `app/robots.ts`, `app/sitemap.ts` (generated from the catalogue — 128 URLs),
  `app/manifest.ts`, `app/opengraph-image.tsx`.
- JSON-LD helpers for `Organization`, `WebSite`, `Restaurant` / `LocalBusiness`
  and `BreadcrumbList`, emitted as a single `@graph` per page.
- Exactly one `<h1>` per page; restaurant content is server-rendered.

No library can guarantee Google indexing. What this gives you is a site that is
cheap to crawl, unambiguous to parse, and ready for Search Console and XML
sitemap submission.

---

## Placeholder content

Every restaurant, outlet, dish, rating and partner brand in `src/data/` is
**fictional demonstration data** created for the launch build. No real
restaurant is represented and no partnership is implied. Photography is
Unsplash editorial, centralised in `src/data/images.ts`.

Before going live: replace `src/data/*`, point `images.remotePatterns` in
`next.config.ts` at your CDN, and set real commercials in `src/data/plans.ts`
(`priceLabel` / `priceNote`).
