import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/seo/site";

/**
 * Brand mark.
 *
 * Drawn inline rather than served as a file: it costs no request, stays crisp
 * at every density, and inherits the brand token so a re-skin needs no new
 * asset export.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="32" height="32" rx="10" className="fill-primary" />
      <circle cx="15" cy="17" r="7.6" stroke="white" strokeWidth="2.2" opacity="0.95" />
      <circle cx="23.2" cy="9.4" r="3" fill="white" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "default",
  showWordmark = true,
}: {
  className?: string;
  tone?: "default" | "inverse";
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-control", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      {showWordmark ? (
        <span
          className={cn(
            "text-[1.32rem] leading-none font-extrabold tracking-[-0.03em]",
            tone === "inverse" ? "text-ink-foreground" : "text-foreground",
          )}
        >
          Dine
          <span className="font-semibold text-primary">Board</span>
        </span>
      ) : null}
    </Link>
  );
}
