"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils/cn";
import { ease } from "@/lib/utils/motion";

/**
 * Glass card that drifts slowly in place — used for the stat overlays on the
 * hero composition.
 *
 * The float is a 6–10px vertical loop; anything larger reads as a toy. Motion
 * for React stops the loop entirely under `prefers-reduced-motion`, and the
 * entrance still plays as a fade so the card never appears out of nowhere.
 */
export function FloatingCard({
  children,
  className,
  delay = 0,
  distance = 8,
  duration = 5,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn(
        "rounded-card border border-white/60 bg-white/85 p-3.5 shadow-lift backdrop-blur-md",
        className,
      )}
    >
      <motion.div
        animate={{ y: [0, -distance, 0] }}
        transition={{
          duration,
          delay: delay + 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
