import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "./site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Site-relative path; becomes the canonical URL. */
  path: string;
  /** Absolute image URL for OG/Twitter cards. */
  image?: string;
  keywords?: string[];
  /** Set for pages that should stay out of the index (e.g. QR resolvers). */
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}

/**
 * Single helper every route uses to produce consistent canonical URLs, Open
 * Graph and Twitter metadata. Titles are composed by the template in the root
 * layout, so pass the bare page title here.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  noIndex = false,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      url: canonical,
      title: `${title} | ${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      site: siteConfig.twitterHandle,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
