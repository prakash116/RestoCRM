import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { partnerBrands } from "@/data/partners";
import { cn } from "@/lib/utils/cn";
import type { PartnerBrand } from "@/types/content";

/**
 * "Restaurants Growing With Us".
 *
 * Every brand shown is a placeholder from `src/data/partners.ts` — invented
 * names with generated monogram marks. Real partner logos go in only with
 * written permission; borrowing a recognisable brand to fill the row would be
 * a false endorsement.
 *
 * The marquee is a CSS transform on a duplicated track (no JS, no layout
 * thrash). It pauses on hover and collapses to a static grid under
 * `prefers-reduced-motion`.
 */
export function PartnerLogos() {
  return (
    <section aria-labelledby="partners-heading" className="overflow-hidden py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="partners-heading"
          eyebrow="Trusted by kitchens"
          title="Restaurants Growing With Us"
          description="From single-kitchen cafes to multi-outlet groups across Delhi NCR."
          align="center"
        />
      </Container>

      <Reveal className="relative mt-12">
        {/* Edge fades so logos dissolve rather than getting clipped. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(to_right,var(--background),transparent)] sm:w-28"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(to_left,var(--background),transparent)] sm:w-28"
        />

        {/* Animated marquee — pointer devices with motion allowed. */}
        <div className="group hidden overflow-hidden motion-safe:block">
          <ul className="flex w-max animate-marquee items-stretch gap-4 group-hover:[animation-play-state:paused]">
            {[...partnerBrands, ...partnerBrands].map((brand, index) => (
              <li
                key={`${brand.id}-${index}`}
                // The duplicated half is decorative repetition, not content.
                aria-hidden={index >= partnerBrands.length}
              >
                <PartnerTile brand={brand} />
              </li>
            ))}
          </ul>
        </div>

        {/* Static fallback for reduced motion. */}
        <Container className="motion-safe:hidden">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partnerBrands.map((brand) => (
              <li key={brand.id}>
                <PartnerTile brand={brand} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Reveal>
    </section>
  );
}

function PartnerTile({ brand, className }: { brand: PartnerBrand; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[5.5rem] w-56 items-center gap-3.5 rounded-card border border-border bg-card px-5",
        "shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-card",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-control bg-[linear-gradient(135deg,var(--primary-soft),var(--secondary))] text-sm font-extrabold tracking-tight text-primary"
      >
        {brand.monogram}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.9375rem] leading-tight font-bold text-foreground">
          {brand.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {brand.category}
        </span>
      </span>
    </div>
  );
}
