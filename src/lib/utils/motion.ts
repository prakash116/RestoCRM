import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language.
 *
 * Everything is short (≤ 0.6s), travels a small distance (≤ 24px) and uses a
 * single easing curve so the whole page feels like one system. Motion for
 * React honours `prefers-reduced-motion` when animations are declared through
 * variants and the `MotionConfig reducedMotion="user"` wrapper in the layout.
 */

/** Gentle deceleration — the house curve. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const transition: Transition = {
  duration: 0.55,
  ease,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

/**
 * Parent for card grids and rails. Children are staggered just enough to read
 * as a sequence without making the last card feel late.
 */
export function staggerContainer(stagger = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Standard viewport config: fire once, slightly before the element lands. */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" } as const;
