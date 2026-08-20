import type { CarouselSlide } from "@/types/content";

import { routes } from "@/lib/utils/routes";

import { promoImages } from "./images";

/**
 * Promotional slides.
 *
 * `overlayClass` is stored with the slide because the required overlay depends
 * on the photograph: a bright image needs a heavier scrim than a dark one to
 * keep the headline above 4.5:1 contrast.
 */
export const carouselSlides: CarouselSlide[] = [
  {
    id: "weekend-offers",
    eyebrow: "This weekend",
    headline: "Weekend Dining Offers",
    description: "Discover exclusive restaurant deals across Delhi, live every Friday to Sunday.",
    image: promoImages["weekend-offers"],
    ctaLabel: "Browse Offers",
    ctaHref: routes.offers(),
    overlayClass:
      "bg-[linear-gradient(100deg,rgb(var(--ink-rgb)/0.92)_0%,rgb(var(--ink-rgb)/0.72)_38%,rgb(var(--ink-rgb)/0.15)_78%)]",
  },
  {
    id: "top-rated",
    eyebrow: "Diner favourites",
    headline: "Top Rated in Delhi",
    description: "Explore the restaurants customers keep coming back to, ranked by real ratings.",
    image: promoImages["top-rated"],
    ctaLabel: "See Top Rated",
    ctaHref: routes.restaurants(),
    overlayClass:
      "bg-[linear-gradient(100deg,rgb(var(--ink-rgb)/0.94)_0%,rgb(var(--ink-rgb)/0.7)_40%,rgb(var(--ink-rgb)/0.12)_80%)]",
  },
  {
    id: "new-restaurants",
    eyebrow: "Just listed",
    headline: "New Restaurants",
    description: "Discover kitchens that joined the platform this month, across 24 localities.",
    image: promoImages["new-restaurants"],
    ctaLabel: "Discover New",
    ctaHref: routes.restaurants(),
    overlayClass:
      "bg-[linear-gradient(100deg,rgb(var(--ink-rgb)/0.93)_0%,rgb(var(--ink-rgb)/0.72)_38%,rgb(var(--ink-rgb)/0.14)_78%)]",
  },
  {
    id: "book-table",
    eyebrow: "Reservations",
    headline: "Book Your Table",
    description: "Skip the waitlist and reserve directly with the restaurant in about 30 seconds.",
    image: promoImages["book-table"],
    ctaLabel: "Book a Table",
    ctaHref: routes.restaurants(),
    overlayClass:
      "bg-[linear-gradient(100deg,rgb(var(--ink-rgb)/0.94)_0%,rgb(var(--ink-rgb)/0.74)_40%,rgb(var(--ink-rgb)/0.16)_80%)]",
  },
];
