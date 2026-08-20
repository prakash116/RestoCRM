import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ThemeApplier } from "@/components/theme/ThemeApplier";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { JsonLd } from "@/lib/seo/JsonLd";
import { siteConfig } from "@/lib/seo/site";
import { buildGraph, organizationSchema, webSiteSchema } from "@/lib/seo/structured-data";
import { buildSearchIndex } from "@/lib/search";

import { Providers } from "./providers";
import "./globals.css";

/* Self-hosted by next/font — no render-blocking request to Google, and the
   metrics-matched fallback keeps CLS at zero while the face loads. */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

/** Used sparingly: the italic accent word in the hero headline. */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Discover Delhi's Best Restaurants`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "food",
  keywords: [
    "restaurants in Delhi",
    "best restaurants Delhi",
    "book a table Delhi",
    "Delhi food discovery",
    "restaurant offers Delhi",
    "restaurant QR menu",
    "restaurant CRM India",
    "list your restaurant",
  ],
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${siteConfig.name} — Discover Delhi's Best Restaurants`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Phone numbers in the footer are already real links; Safari's auto-linking
  // would otherwise restyle body copy unpredictably.
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcfdff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Built on the server so the full catalogue never reaches the browser.
  const searchIndex = buildSearchIndex();

  return (
    // `suppressHydrationWarning`: the bootstrap script below writes inline
    // custom properties onto <html> before React hydrates, and React must
    // accept the DOM it finds rather than reverting to the server output.
    <html
      lang="en-IN"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <JsonLd data={buildGraph(organizationSchema(), webSiteSchema())} />

        <Providers>
          <ThemeApplier />
          <SiteChrome header={<Header searchIndex={searchIndex} />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
