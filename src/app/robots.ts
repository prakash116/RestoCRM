import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";

/**
 * Crawl rules.
 *
 * QR resolver URLs and the restaurant console are deliberately excluded: the
 * former are single-use redirects that would bloat the index with duplicate
 * menu content, the latter is authenticated.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/q/", "/restaurant/login", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
