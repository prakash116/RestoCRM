"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { setQuery } from "@/lib/features/restaurants/restaurantsSlice";
import { useAppDispatch } from "@/lib/hooks";
import { filterSearchIndex, type SearchIndexEntry } from "@/lib/search";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";
import { useDismissable } from "@/lib/utils/useDismissable";

import { LocationSelector } from "./LocationSelector";
import { SearchSuggestions } from "./SearchSuggestions";

/**
 * Primary discovery search.
 *
 * `hero` renders the full composite control — location picker, input and
 * submit button in one pill. `plain` drops the location picker for the mobile
 * navigation drawer, where the city is already chosen in the header.
 *
 * The index arrives as a prop from a Server Component so the catalogue never
 * ships to the browser twice.
 */
export function SearchBar({
  index,
  variant = "hero",
  autoFocus = false,
  className,
}: {
  index: SearchIndexEntry[];
  variant?: "hero" | "plain";
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const optionId = useCallback((position: number) => `${baseId}-option-${position}`, [baseId]);

  const results = useMemo(() => filterSearchIndex(index, value, 6), [index, value]);
  const showPanel = open && value.trim().length > 0;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  useDismissable(containerRef, showPanel, close);

  const goTo = useCallback(
    (href: string) => {
      close();
      inputRef.current?.blur();
      router.push(href);
    },
    [close, router],
  );

  const submit = useCallback(() => {
    const trimmed = value.trim();
    dispatch(setQuery(trimmed));
    goTo(trimmed ? routes.search(trimmed) : routes.restaurants());
  }, [dispatch, goTo, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showPanel || results.length === 0) {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((current) => (current + 1) % results.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) goTo(results[activeIndex].href);
          else submit();
          break;
        case "Escape":
          close();
          break;
        default:
          break;
      }
    },
    [activeIndex, close, goTo, results, showPanel, submit],
  );

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-panel border border-border bg-card p-2",
          isHero ? "shadow-lift sm:rounded-pill" : "shadow-soft",
          "flex-col sm:flex-row",
        )}
      >
        {isHero ? (
          <>
            <div className="w-full sm:w-auto">
              <LocationSelector tone="hero" className="w-full" />
            </div>
            <span
              aria-hidden="true"
              className="hidden h-7 w-px shrink-0 bg-border sm:block"
            />
          </>
        ) : null}

        <div className="relative flex w-full min-w-0 flex-1 items-center">
          <Search
            className="pointer-events-none absolute left-3 size-[1.15rem] text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={value}
            autoFocus={autoFocus}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search restaurant, cuisine or dish..."
            aria-label="Search restaurants, cuisines and dishes"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={showPanel ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              showPanel && activeIndex >= 0 ? optionId(activeIndex) : undefined
            }
            className={cn(
              "h-11 w-full min-w-0 rounded-pill bg-transparent pr-3 pl-10 text-[0.9375rem]",
              "text-foreground placeholder:text-muted-foreground focus:outline-none",
              // Chrome's native search clear button clashes with the pill.
              "[&::-webkit-search-cancel-button]:hidden",
            )}
          />
        </div>

        <button
          type="submit"
          className={cn(
            "inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-pill px-6",
            "bg-primary text-[0.9375rem] font-semibold text-primary-foreground",
            "transition-[background-color,box-shadow] duration-200 hover:bg-primary-strong hover:shadow-glow",
            "sm:w-auto",
          )}
        >
          <Search className="size-4 sm:hidden" aria-hidden="true" />
          Search Restaurants
        </button>
      </form>

      {showPanel ? (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 z-40 w-full overflow-hidden rounded-card border border-border bg-card shadow-lift">
          <SearchSuggestions
            results={results}
            activeIndex={activeIndex}
            onSelect={(entry) => goTo(entry.href)}
            onHoverIndex={setActiveIndex}
            listId={listId}
            optionId={optionId}
            emptyQuery={value.trim()}
          />
        </div>
      ) : null}
    </div>
  );
}
