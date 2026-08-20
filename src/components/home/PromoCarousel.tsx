"use client";

import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { carouselSlides } from "@/data/carousel";
import { BLUR_DARK } from "@/data/images";
import { cn } from "@/lib/utils/cn";

const AUTOPLAY_DELAY = 6000;

/**
 * Promotional carousel.
 *
 * Autoplay pauses on hover and on keyboard focus, and stops permanently once
 * the visitor takes control — content that keeps moving under someone reading
 * it is a WCAG 2.2.2 failure, not a flourish.
 */
export function PromoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", duration: 26 }, [
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  ]);

  /* Embla owns the selected index — subscribing to it as an external store
     keeps React in sync without an effect that writes state on every mount. */
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", notify).on("reInit", notify);
      return () => {
        emblaApi.off("select", notify).off("reInit", notify);
      };
    },
    [emblaApi],
  );

  const selectedIndex = useSyncExternalStore(
    subscribe,
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section aria-labelledby="promo-heading" className="py-8 sm:py-10">
      <h2 id="promo-heading" className="sr-only">
        Featured offers and collections
      </h2>

      <Container>
        <div
          className="group relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured offers and collections"
        >
          <div ref={emblaRef} className="overflow-hidden rounded-panel">
            <div className="flex touch-pan-y">
              {carouselSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${carouselSlides.length}: ${slide.headline}`}
                  aria-hidden={index !== selectedIndex}
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-ink sm:aspect-video lg:aspect-[2.6/1]">
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      sizes="(min-width: 1440px) 1400px, 100vw"
                      // Every slide lazy-loads. The carousel sits below the
                      // fold, and preloading slide one would put a second
                      // high-priority image request in front of the hero's
                      // LCP fetch for no visible gain — the browser's lazy
                      // distance threshold starts it early enough anyway.
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DARK}
                      className="object-cover"
                    />
                    <span aria-hidden="true" className={cn("absolute inset-0", slide.overlayClass)} />

                    <div className="relative flex h-full items-end p-6 sm:items-center sm:p-10 lg:p-14">
                      <div className="max-w-lg">
                        <p className="text-xs font-bold tracking-[0.16em] text-primary-soft uppercase">
                          {slide.eyebrow}
                        </p>
                        <p className="mt-3 text-[1.75rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
                          {slide.headline}
                        </p>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                          {slide.description}
                        </p>
                        <Link
                          href={slide.ctaHref}
                          // Off-screen slides must not be reachable by Tab.
                          tabIndex={index === selectedIndex ? undefined : -1}
                          className="group/cta mt-6 inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 text-[0.9375rem] font-semibold text-ink transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                        >
                          {slide.ctaLabel}
                          <ArrowRight
                            className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CarouselArrow direction="prev" onClick={scrollPrev} />
          <CarouselArrow direction="next" onClick={scrollNext} />

          <div className="mt-5 flex items-center justify-center gap-2">
            {carouselSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
                aria-current={index === selectedIndex}
                className={cn(
                  "h-2 rounded-pill transition-all duration-300",
                  index === selectedIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-white/25 bg-ink/45 text-white backdrop-blur-sm",
        "transition-[background-color,opacity] duration-200 hover:bg-ink/75",
        // Revealed on hover for pointer users; always available to keyboards
        // via focus-visible.
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        "sm:grid",
        direction === "prev" ? "left-4" : "right-4",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
