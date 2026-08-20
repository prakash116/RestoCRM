"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, TrendingUp, X } from "lucide-react";

import { SearchSuggestions } from "@/components/ui/SearchSuggestions";
import { filterSearchIndex, trendingSearches, type SearchIndexEntry } from "@/lib/search";
import { ease } from "@/lib/utils/motion";
import { routes } from "@/lib/utils/routes";

/**
 * Command-palette search, opened from the header or with ⌘K / Ctrl+K.
 *
 * Chosen over a permanently expanded header field: the header already carries
 * navigation, location, login and the primary CTA at 1024px, and a full-width
 * overlay gives search far more room for results than a cramped inline input
 * ever could.
 */
export function SearchOverlay({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchIndexEntry[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const optionId = useCallback((position: number) => `${baseId}-option-${position}`, [baseId]);

  const results = useMemo(() => filterSearchIndex(index, value, 8), [index, value]);
  const hasQuery = value.trim().length > 0;

  /* Reset between openings so the palette never reopens mid-query. Done during
     render rather than in an effect, so the panel's first paint is already
     empty instead of flashing the previous search. */
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setValue("");
      setActiveIndex(-1);
    }
  }

  /* Lock the page behind the dialog, compensating for the scrollbar so the
     layout underneath does not jump sideways as it disappears. */
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  const goTo = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const submit = useCallback(() => {
    const trimmed = value.trim();
    goTo(trimmed ? routes.search(trimmed) : routes.restaurants());
  }, [goTo, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (!hasQuery || results.length === 0) {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) goTo(results[activeIndex].href);
        else submit();
      }
    },
    [activeIndex, goTo, hasQuery, onClose, results, submit],
  );

  /* Keep Tab inside the dialog — there is only one focusable region, so a
     simple wrap between first and last is enough. */
  const handlePanelKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input, a[href]',
    );
    if (!focusables || focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-70 flex items-start justify-center px-4 pt-[12vh] sm:px-6"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 -z-10 cursor-default bg-ink/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search restaurants and dishes"
            onKeyDown={handlePanelKeyDown}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.24, ease }}
            className="w-full max-w-2xl overflow-hidden rounded-panel border border-border bg-card shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search restaurant, cuisine or dish..."
                aria-label="Search restaurants, cuisines and dishes"
                role="combobox"
                aria-expanded={hasQuery}
                aria-controls={hasQuery ? listId : undefined}
                aria-autocomplete="list"
                aria-activedescendant={
                  hasQuery && activeIndex >= 0 ? optionId(activeIndex) : undefined
                }
                className="h-10 w-full min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[min(28rem,60vh)] overflow-y-auto">
              {hasQuery ? (
                <SearchSuggestions
                  results={results}
                  activeIndex={activeIndex}
                  onSelect={(entry) => goTo(entry.href)}
                  onHoverIndex={setActiveIndex}
                  listId={listId}
                  optionId={optionId}
                  emptyQuery={value.trim()}
                  size="lg"
                />
              ) : (
                <div className="p-4">
                  <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                    <TrendingUp className="size-3.5" aria-hidden="true" />
                    Trending in Delhi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => goTo(routes.search(term))}
                        className="rounded-pill border border-border px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-strong"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden items-center gap-4 border-t border-border bg-muted/60 px-4 py-2.5 text-xs text-muted-foreground sm:flex">
              <KeyHint keys={["↑", "↓"]} label="Navigate" />
              <KeyHint keys={["Enter"]} label="Open" />
              <KeyHint keys={["Esc"]} label="Close" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[0.6875rem] font-semibold text-foreground"
        >
          {key}
        </kbd>
      ))}
      {label}
    </span>
  );
}
