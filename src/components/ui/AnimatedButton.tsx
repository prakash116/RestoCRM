"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";

/**
 * Hero-grade call to action.
 *
 * Adds a press response and a light sheen that sweeps across on hover. Reach
 * for the plain `Button` everywhere else — the CSS-only version costs no
 * JavaScript, and reserving this treatment for two or three buttons is what
 * keeps it feeling special.
 */
export function AnimatedButton({
  href,
  variant = "primary",
  size = "lg",
  className,
  children,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
}) {
  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 ease-out group-hover/btn:translate-x-full motion-reduce:hidden"
      />
    </>
  );

  const classes = buttonClasses(
    variant,
    size,
    `group/btn relative overflow-hidden ${className ?? ""}`,
  );

  if (href) {
    return (
      <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.97 }}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
