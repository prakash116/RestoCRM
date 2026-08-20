import type { MetadataRoute } from "next";

import { absoluteUrl, sitePath } from "@/lib/seo/site";

export const dynamic = "force-static";

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
        allow: sitePath("/"),
        disallow: [
          sitePath("/q/"),
          sitePath("/restaurant/login"),
          sitePath("/dashboard"),
          sitePath("/api/"),
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
