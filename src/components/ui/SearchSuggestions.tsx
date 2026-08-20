"use client";

import Image from "next/image";
import { Search, Store, UtensilsCrossed } from "lucide-react";

import { BLUR_WARM } from "@/data/images";
import type { SearchEntryType, SearchIndexEntry } from "@/lib/search";
import { cn } from "@/lib/utils/cn";

const typeMeta: Record<SearchEntryType, { icon: typeof Store; label: string }> = {
  restaurant: { icon: Store, label: "Restaurant" },
  dish: { icon: UtensilsCrossed, label: "Dish" },
  cuisine: { icon: Search, label: "Cuisine" },
};

/**
 * Suggestion list shared by the hero search field and the header overlay.
 *
 * Implements the ARIA combobox listbox contract: options are `role="option"`
 * with `aria-selected`, and the parent input owns `aria-activedescendant`
 * pointing at `optionId(activeIndex)`.
 */
export function SearchSuggestions({
  results,
  activeIndex,
  onSelect,
  onHoverIndex,
  listId,
  optionId,
  emptyQuery,
  size = "md",
}: {
  results: SearchIndexEntry[];
  activeIndex: number;
  onSelect: (entry: SearchIndexEntry) => void;
  onHoverIndex: (index: number) => void;
  listId: string;
  optionId: (index: number) => string;
  /** The current query, echoed in the no-results message. */
  emptyQuery: string;
  size?: "md" | "lg";
}) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-semibold text-foreground">
          No matches for &ldquo;{emptyQuery}&rdquo;
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a cuisine, a dish or a Delhi locality.
        </p>
      </div>
    );
  }

  return (
    <ul id={listId} role="listbox" aria-label="Search suggestions" className="p-1.5">
      {results.map((entry, index) => {
        const meta = typeMeta[entry.type];
        const Icon = meta.icon;
        const active = index === activeIndex;

        return (
          <li key={entry.id} role="none">
            <button
              type="button"
              id={optionId(index)}
              role="option"
              aria-selected={active}
              // `onMouseDown` fires before the input's blur, so the click is
              // not swallowed by the panel unmounting.
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(entry);
              }}
              onMouseEnter={() => onHoverIndex(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-control text-left transition-colors",
                size === "lg" ? "p-2.5" : "p-2",
                active ? "bg-muted" : "hover:bg-muted/70",
              )}
            >
              <span
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-control bg-muted",
                  size === "lg" ? "size-12" : "size-10",
                )}
              >
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="48px"
                  placeholder="blur"
                  blurDataURL={BLUR_WARM}
                  className="object-cover"
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {entry.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {entry.sublabel}
                </span>
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-muted px-2 py-1 text-[0.6875rem] font-semibold text-muted-foreground">
                <Icon className="size-3" aria-hidden="true" />
                {meta.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
