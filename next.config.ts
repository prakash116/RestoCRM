import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: process.env.PAGES_BASE_PATH,
        trailingSlash: true,
      }
    : {}),

  images: {
    // Unsplash is backed by Imgix, so let its CDN perform the resize instead of
    // proxying every image through the Next.js server. This also works for the
    // GitHub Pages static export, where there is no /_next/image endpoint.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Placeholder editorial imagery. Replace this host with the platform CDN
    // once real restaurant assets are uploaded — see `src/data/images.ts`.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Next 16 restricts `quality` to this list; keep it small so the optimizer
    // cache stays warm.
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
    // Card thumbnails are never rendered below 64px wide.
    imageSizes: [64, 96, 128, 256, 384],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920, 2560],
  },

  // Static hosts cannot apply response headers. Preserve them for Node.js
  // deployments and omit the unsupported option from the Pages build.
  ...(!isGitHubPages
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(self)",
                },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
