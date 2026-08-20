import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — Discover Delhi's Best Restaurants`;

/**
 * Social share card.
 *
 * Generated at build time rather than shipped as a static PNG so the brand
 * colours stay in sync with the design tokens. Uses the runtime's default
 * font — no remote font fetch, so the build never depends on a third party
 * being reachable.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#1a1210",
          backgroundImage:
            "radial-gradient(circle at 12% 100%, rgba(214,58,40,0.55), transparent 55%), radial-gradient(circle at 88% 0%, rgba(240,161,42,0.38), transparent 55%)",
          color: "#f8f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "22px",
              backgroundColor: "#d63a28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "5px solid #ffffff",
              }}
            />
          </div>
          <div style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              maxWidth: "900px",
            }}
          >
            Discover Delhi&apos;s Best Restaurants
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "32px",
              color: "#b8a89c",
              maxWidth: "820px",
              lineHeight: 1.35,
            }}
          >
            Top-rated restaurants, trending dishes, live offers and table booking — in one place.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: "999px",
              backgroundColor: "#d63a28",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            Now live in Delhi NCR
          </div>
          <div style={{ fontSize: "26px", color: "#b8a89c" }}>
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
