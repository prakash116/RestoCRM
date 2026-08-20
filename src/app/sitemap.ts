import type { MetadataRoute } from "next";

import { cuisines } from "@/data/cuisines";
import { restaurants } from "@/data/restaurants";
import { absoluteUrl } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

export const dynamic = "force-static";

/**
 * XML sitemap.
 *
 * Restaurant, outlet and cuisine URLs are generated from the catalogue rather
 * than hand-listed, so onboarding a restaurant publishes its pages to the
 * sitemap automatically. When the catalogue outgrows the 50,000-URL limit,
 * split this with `generateSitemaps()` — the shape below stays the same.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.home()), lastModified, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl(routes.restaurants()), lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl(routes.dishes()), lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl(routes.pricing()), lastModified, changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl(routes.listRestaurant()),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: absoluteUrl(routes.about()), lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl(routes.contact()), lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl(routes.careers()), lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl(routes.blog()), lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: absoluteUrl(routes.privacy()), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl(routes.terms()), lastModified, changeFrequency: "yearly", priority: 0.2 },
    {
      url: absoluteUrl(routes.refundPolicy()),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const cuisineEntries: MetadataRoute.Sitemap = cuisines.map((cuisine) => ({
    url: absoluteUrl(routes.cuisine(cuisine.slug)),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const restaurantEntries: MetadataRoute.Sitemap = restaurants.flatMap((restaurant) => [
    {
      url: absoluteUrl(routes.restaurant(restaurant.slug)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...restaurant.outlets.flatMap((outlet) => [
      {
        url: absoluteUrl(routes.outlet(restaurant.slug, outlet.slug)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      },
      {
        url: absoluteUrl(routes.outletMenu(restaurant.slug, outlet.slug)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: absoluteUrl(routes.outletOffers(restaurant.slug, outlet.slug)),
        lastModified,
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
      {
        url: absoluteUrl(routes.outletReviews(restaurant.slug, outlet.slug)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ]),
  ]);

  return [...staticEntries, ...cuisineEntries, ...restaurantEntries];
}
