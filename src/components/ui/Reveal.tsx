"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils/cn";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/utils/motion";

/**
 * Scroll-triggered entrance.
 *
 * Fires once and only when at least 20% of the element is visible, so nothing
 * animates off-screen. `MotionConfig reducedMotion="user"` in the root
 * providers flattens these to opacity-only for users who ask for less motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Parent for card grids. Children must be `RevealItem`s (or any element using
 * the `fadeUp` variants) for the stagger to apply.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "section";
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];

  return (
    <Component className={cn(className)} variants={fadeUp}>
      {children}
    </Component>
  );
}
