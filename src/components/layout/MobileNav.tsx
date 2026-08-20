"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, LogIn, X } from "lucide-react";

import { LocationSelector } from "@/components/ui/LocationSelector";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "@/components/ui/SearchBar";
import { mobileNav } from "@/data/navigation";
import type { SearchIndexEntry } from "@/lib/search";
import { ease } from "@/lib/utils/motion";
import { routes } from "@/lib/utils/routes";

/**
 * Slide-in navigation drawer for phones and small tablets.
 *
 * A vertical list has room the header row does not, so it carries "Popular
 * Dishes" alongside the three header destinations, plus the search field and
 * both account actions — nothing here is reachable on desktop only.
 */
export function MobileNav({
  open,
  onClose,
  searchIndex,
}: {
  open: boolean;
  onClose: () => void;
  searchIndex: SearchIndexEntry[];
}) {
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      body.style.overflow = previous;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-65 lg:hidden"
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease }}
            className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-background shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              <SearchBar index={searchIndex} variant="plain" className="mb-6" />

              <div className="mb-6">
                <p className="mb-2 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  Location
                </p>
                <LocationSelector className="w-full [&>button]:w-full [&>button]:justify-start" />
              </div>

              <nav aria-label="Main">
                <ul className="space-y-1">
                  {mobileNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between gap-3 rounded-control px-3 py-3.5 transition-colors hover:bg-muted"
                      >
                        <span>
                          <span className="block text-[0.9375rem] font-semibold text-foreground">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="space-y-2.5 border-t border-border p-5">
              <Link
                href={routes.listRestaurant()}
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
              >
                List Your Restaurant
              </Link>
              <Link
                href={routes.restaurantLogin()}
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-border text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Restaurant Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
