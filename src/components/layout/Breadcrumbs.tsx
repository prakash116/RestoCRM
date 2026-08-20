import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbSchema, buildGraph } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  name: string;
  /** Site-relative path. The last crumb renders as plain text. */
  path: string;
}

/**
 * Visible breadcrumb trail plus the matching `BreadcrumbList` JSON-LD, emitted
 * together so the two can never drift apart.
 */
export function Breadcrumbs({
  items,
  tone = "default",
  className,
}: {
  items: Crumb[];
  tone?: "default" | "inverse";
  className?: string;
}) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={buildGraph(breadcrumbSchema(trail))} />

      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight
                    className={cn(
                      "size-3.5 shrink-0",
                      tone === "inverse" ? "text-ink-muted" : "text-muted-foreground/60",
                    )}
                    aria-hidden="true"
                  />
                ) : null}

                {isLast ? (
                  <span
                    aria-current="page"
                    className={cn(
                      "font-semibold",
                      tone === "inverse" ? "text-ink-foreground" : "text-foreground",
                    )}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={cn(
                      "rounded-sm transition-colors",
                      tone === "inverse"
                        ? "text-ink-muted hover:text-ink-foreground"
                        : "text-muted-foreground hover:text-primary",
                    )}
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
