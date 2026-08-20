"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Loads the Three.js ambient layer only when it is genuinely worth the bytes.
 *
 * Three.js is roughly 150 kB gzipped — far too much to put in the critical
 * path for a decorative effect. The gate below keeps it off the LCP path
 * entirely: nothing is requested until the browser is idle, and never at all
 * on small screens, reduced-motion preferences, save-data connections or
 * low-core devices, where the effect either does not show or costs more than
 * it gives.
 */
const HeroAmbient = dynamic(() => import("./HeroAmbient"), { ssr: false });

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

export function HeroAmbientLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) {
      return;
    }

    // Safari only shipped requestIdleCallback recently; fall back to a timer.
    const supportsIdleCallback = typeof window.requestIdleCallback === "function";
    const handle = supportsIdleCallback
      ? window.requestIdleCallback(() => setEnabled(true), { timeout: 2500 })
      : window.setTimeout(() => setEnabled(true), 1200);

    return () => {
      if (supportsIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  if (!enabled) return null;
  return <HeroAmbient />;
}
