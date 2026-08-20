"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { Logo } from "@/components/ui/Logo";
import { primaryNav } from "@/data/navigation";
import type { SearchIndexEntry } from "@/lib/search";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";

/**
 * Nav highlight matching.
 *
 * Compares whole path segments, so `/restaurants` lights up on
 * `/restaurants/copper-tandoor` but never on `/restaurant/login`.
 *
 * Items carrying a query string ("Offers" points at `/restaurants?offers=1`)
 * never highlight. The header renders in the root layout, so reading the query
 * with `useSearchParams` here would opt every static page out of
 * prerendering — and matching on pathname alone would light up "Restaurants"
 * and "Offers" simultaneously, which just reads as a bug.
 */
function isActiveNav(pathname: string, href: string): boolean {
  if (href.includes("?")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky marketplace header.
 *
 * Sits flush over the hero's warm background and gains a translucent surface,
 * border and shadow once the page scrolls, so the boundary only appears when
 * there is content to separate from.
 */
export function Header({ searchIndex }: { searchIndex: SearchIndexEntry[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  /* Scroll state, read inside rAF so the listener never forces layout on the
     scroll thread. */
  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ⌘K / Ctrl+K opens search from anywhere. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* A route change should never leave an overlay hanging. Adjusted during
     render rather than in an effect so the overlay is already gone on the
     first frame of the new page — an effect would paint it once more first. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="sr-focusable fixed top-3 left-3 z-80 rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-b border-border bg-background/85 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent bg-background/0",
        )}
      >
        {/* Gaps tighten at lg and only open up at xl: at exactly 1024px the
            logo, three nav items, search, location, login and the CTA leave
            almost no slack. */}
        <Container className="flex h-16 items-center gap-3 lg:h-18 lg:gap-4 xl:gap-6">
          <Logo className="shrink-0" />

          <nav aria-label="Main" className="hidden shrink-0 flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = isActiveNav(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-pill px-3 py-2 text-[0.9375rem] font-semibold whitespace-nowrap xl:px-3.5",
                        "transition-colors duration-200",
                        active
                          ? "bg-primary-soft text-primary-strong"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search restaurants and dishes"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-pill border border-border bg-card px-3 text-sm font-medium",
                "text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground",
                "xl:w-52 xl:justify-start",
              )}
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline">Search…</span>
              <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[0.6875rem] font-semibold xl:inline">
                ⌘K
              </kbd>
            </button>

            <div className="hidden lg:block">
              <LocationSelector />
            </div>

            <Link
              href={routes.restaurantLogin()}
              className="hidden h-10 items-center rounded-pill px-3 text-[0.9375rem] font-semibold whitespace-nowrap text-foreground transition-colors hover:bg-muted lg:inline-flex xl:px-3.5"
            >
              Login
            </Link>

            {/* The label shortens between 1024px and 1280px, where the full
                wording is what tips the row over. Only one span is ever
                rendered, so the accessible name always matches what is on
                screen. */}
            <Link
              href={routes.listRestaurant()}
              className={cn(
                "hidden h-10 items-center rounded-pill bg-primary px-4 text-[0.9375rem] font-semibold whitespace-nowrap text-primary-foreground",
                "shadow-soft transition-[background-color,box-shadow] duration-200 hover:bg-primary-strong hover:shadow-glow",
                "md:inline-flex",
              )}
            >
              <span className="lg:hidden xl:inline">List Your Restaurant</span>
              <span className="hidden lg:inline xl:hidden">List Restaurant</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      <MobileNav open={menuOpen} onClose={closeMenu} searchIndex={searchIndex} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} index={searchIndex} />
    </>
  );
}
