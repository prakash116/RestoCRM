"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AnalyticsAmbient = dynamic(() => import("./AnalyticsAmbient"), { ssr: false });

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Load the decorative WebGL layer only when the device can afford it. */
export function AnalyticsAmbientLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || (connection?.effectiveType && /2g/.test(connection.effectiveType))) {
      return;
    }
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) {
      return;
    }

    const supportsIdleCallback = typeof window.requestIdleCallback === "function";
    const handle = supportsIdleCallback
      ? window.requestIdleCallback(() => setEnabled(true), { timeout: 2200 })
      : window.setTimeout(() => setEnabled(true), 1000);

    return () => {
      if (supportsIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return enabled ? <AnalyticsAmbient /> : null;
}
