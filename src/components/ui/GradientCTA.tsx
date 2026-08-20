import Image from "next/image";

import { BLUR_DARK } from "@/data/images";
import { cn } from "@/lib/utils/cn";

/**
 * Dark conversion panel.
 *
 * The photograph sits at low opacity under two brand-tinted radial washes so
 * the headline keeps well above 4.5:1 contrast no matter which image is
 * supplied. Content is passed in as children — this component owns the
 * treatment, not the copy.
 */
export function GradientCTA({
  children,
  image,
  imageAlt = "",
  className,
}: {
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-panel bg-ink text-ink-foreground",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 1400px"
          placeholder="blur"
          blurDataURL={BLUR_DARK}
          className="-z-20 object-cover opacity-25"
        />
      ) : null}

      {/* Brand wash from the lower-left. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--primary-rgb)/0.55),transparent_65%)] blur-3xl"
      />
      {/* Lighter periwinkle counter-light from the upper-right. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-20 -z-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(var(--accent-rgb)/0.4),transparent_66%)] blur-3xl"
      />
      {/* Base scrim guarantees legibility over the photograph. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgb(var(--ink-rgb)/0.86),rgb(var(--ink-rgb)/0.62))]"
      />

      {children}
    </div>
  );
}
