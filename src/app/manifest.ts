import type { MetadataRoute } from "next";

import { siteConfig, sitePath } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Discover Delhi's Best Restaurants`,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: sitePath("/"),
    display: "standalone",
    background_color: "#fffcf9",
    theme_color: "#d63a28",
    lang: "en-IN",
    categories: ["food", "lifestyle", "business"],
    icons: [
      {
        src: sitePath("/icon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
