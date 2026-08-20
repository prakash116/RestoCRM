import type { Metadata } from "next";

import { OfflineArcade } from "@/components/network/OfflineArcade";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Offline Arcade",
  description: "A locally saved Rock, Paper, Scissors game for moments without a connection.",
  path: "/offline",
  noIndex: true,
});

export default function OfflinePage() {
  return <OfflineArcade />;
}
