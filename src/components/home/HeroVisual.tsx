"use client";

import Image from "next/image";
import { CalendarCheck, QrCode, Star } from "lucide-react";

import { FloatingCard } from "@/components/ui/FloatingCard";
import { BLUR_WARM, heroImages } from "@/data/images";

import { HeroAmbientLoader } from "./HeroAmbientLoader";

/**
 * Hero composition: one editorial photograph with glass product cards floating
 * over it, plus the optional ambient particle layer behind.
 *
 * The photograph is the LCP candidate on desktop, so it loads eagerly at high
 * fetch priority and is *not* wrapped in any JS-driven entrance — only the
 * decorative cards animate.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[32rem] lg:max-w-none">
      <HeroAmbientLoader />

      <div className="relative">
        {/* Brand halo behind the frame. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_55%_at_60%_35%,rgb(var(--accent-rgb)/0.28),transparent_70%)] blur-2xl"
        />

        <div className="relative aspect-4/5 w-full overflow-hidden rounded-panel border border-white/60 bg-muted shadow-lift sm:aspect-4/5 lg:aspect-[5/6]">
          <Image
            src={heroImages.primary}
            alt="Diners at a warmly lit restaurant table in Delhi"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 28rem, (min-width: 640px) 32rem, 92vw"
            placeholder="blur"
            blurDataURL={BLUR_WARM}
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(190deg,rgb(var(--ink-rgb)/0)_45%,rgb(var(--ink-rgb)/0.45)_100%)]"
          />
        </div>

        {/* Booking confirmation — the platform's core diner action. */}
        <FloatingCard
          delay={0.35}
          className="absolute -top-4 -left-3 w-[13.5rem] sm:-left-8 lg:-left-12"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success-soft">
              <CalendarCheck className="size-5 text-success" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.8125rem] leading-tight font-bold text-card-foreground">
                Table confirmed
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Copper Tandoor · 8:30 PM
              </span>
            </span>
          </div>
        </FloatingCard>

        {/* Dish rating — the discovery half of the marketplace. */}
        <FloatingCard
          delay={0.55}
          duration={5.8}
          className="absolute -right-2 bottom-24 w-[14.5rem] sm:-right-6 lg:-right-10"
        >
          <div className="flex items-center gap-3">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-control bg-muted">
              <Image
                src={heroImages.dishInset}
                alt=""
                fill
                sizes="44px"
                placeholder="blur"
                blurDataURL={BLUR_WARM}
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.8125rem] leading-tight font-bold text-card-foreground">
                Butter Chicken
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-card-foreground/70">
                <Star className="size-3 fill-star text-star" aria-hidden="true" />
                4.8
                <span className="font-normal text-muted-foreground">· #1 trending</span>
              </span>
            </span>
          </div>
        </FloatingCard>

        {/* QR scan — the restaurant-facing half. */}
        <FloatingCard
          delay={0.75}
          duration={6.4}
          distance={6}
          className="absolute -bottom-5 left-2 hidden w-[12.5rem] sm:block lg:-left-6"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft">
              <QrCode className="size-5 text-primary-strong" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.8125rem] leading-tight font-bold text-card-foreground">
                Scan to order
              </span>
              <span className="block truncate text-xs text-muted-foreground">Table 12 · live menu</span>
            </span>
          </div>
        </FloatingCard>
      </div>
    </div>
  );
}
