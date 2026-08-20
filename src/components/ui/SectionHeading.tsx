import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  /** Small kicker above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Trailing link, rendered inline on desktop and below the copy on mobile. */
  action?: { label: string; href: string };
  align?: "left" | "center";
  /** Only the hero uses `h1`; every section heading is an `h2` by default. */
  as?: "h2" | "h3";
  tone?: "default" | "inverse";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  tone = "default",
  className,
  id,
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-3 text-xs font-bold tracking-[0.16em] uppercase",
              inverse ? "text-primary-soft" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        ) : null}

        <Heading
          id={id}
          className={cn(
            "text-balance-tight text-3xl leading-[1.1] font-extrabold sm:text-4xl lg:text-[2.75rem]",
            inverse ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {title}
        </Heading>

        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              inverse ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 rounded-pill border px-5 py-2.5 text-sm font-semibold transition-colors",
            inverse
              ? "border-white/20 text-ink-foreground hover:border-white/50 hover:bg-white/10"
              : "border-border bg-card text-foreground shadow-soft hover:border-primary/40 hover:text-primary",
          )}
        >
          {action.label}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </Reveal>
  );
}
