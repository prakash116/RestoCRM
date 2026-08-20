"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";

import { ease } from "@/lib/utils/motion";
import { routes } from "@/lib/utils/routes";

/**
 * Persistent conversion bar for phones.
 *
 * Appears once the visitor has scrolled past the hero — showing it immediately
 * would cover the hero's own CTAs. The footer reserves matching bottom padding
 * on phones so the bar never covers the last row of links.
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.75);
        ticking = false;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center gap-2.5">
              <Link
                href={routes.restaurants()}
                aria-label="Browse all restaurants"
                className="grid size-12 shrink-0 place-items-center rounded-pill border border-border bg-card text-foreground"
              >
                <Search className="size-5" aria-hidden="true" />
              </Link>

              <Link
                href={routes.listRestaurant()}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-primary text-[0.9375rem] font-semibold text-primary-foreground shadow-glow"
              >
                List Your Restaurant
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
