import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Standard page masthead for every route below the homepage: breadcrumbs, a
 * single `h1`, supporting copy and an optional action slot.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border pt-8 pb-12 lg:pt-10 lg:pb-16",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_70%_at_12%_0%,rgba(253,236,232,0.85),transparent_62%),radial-gradient(45%_55%_at_92%_5%,rgba(253,242,227,0.9),transparent_65%)]"
      />

      <Container>
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 text-xs font-bold tracking-[0.16em] text-primary uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="text-balance-tight text-3xl leading-[1.08] font-extrabold sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
