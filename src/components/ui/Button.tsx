import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "ink" | "soft" | "outline-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-200 " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-strong hover:shadow-glow",
  secondary:
    "bg-card text-foreground border border-border shadow-soft hover:border-primary/40 hover:text-primary",
  ghost: "text-foreground hover:bg-muted",
  ink: "bg-ink text-ink-foreground hover:bg-ink/90 shadow-soft",
  soft: "bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground",
  "outline-light":
    "border border-white/30 text-white hover:bg-white hover:text-ink backdrop-blur-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders an `<a>` when `href` is present and a `<button>` otherwise — the
 * semantic distinction matters for keyboard users and screen readers, so it is
 * never left to a styling prop.
 */
export function Button({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps &
  (
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className">)
    | ({ href?: undefined } & Omit<React.ComponentPropsWithoutRef<"button">, "className">)
  )) {
  if (href) {
    const linkProps = props as Omit<React.ComponentPropsWithoutRef<typeof Link>, "href">;
    return (
      <Link href={href} className={buttonClasses(variant, size, className)} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ComponentPropsWithoutRef<"button">;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={buttonClasses(variant, size, className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
