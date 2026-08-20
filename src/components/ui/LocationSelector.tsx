"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";

import { cities, getCity } from "@/data/cities";
import { setCity, setLocality } from "@/lib/features/location/locationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/cn";
import { useDismissable } from "@/lib/utils/useDismissable";

/**
 * City + locality picker.
 *
 * Delhi is the only live market; the rest render disabled with a "Coming soon"
 * hint so the roadmap is visible without implying coverage that does not
 * exist. Selection lives in Redux because the hero, header and listing filters
 * all read from it.
 */
export function LocationSelector({
  tone = "default",
  className,
}: {
  tone?: "default" | "hero";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const dispatch = useAppDispatch();
  const { cityId, cityName, locality } = useAppSelector((state) => state.location);

  const close = useCallback(() => setOpen(false), []);
  useDismissable(containerRef, open, close);

  const activeCity = getCity(cityId) ?? cities[0];
  const label = locality ?? cityName;

  return (
    // The root lifts to `z-50` only while the panel is open, so the selector
    // wins against sibling content wherever it is mounted (hero, header,
    // mobile drawer) without permanently outranking anything when closed.
    <div ref={containerRef} className={cn("relative", open && "z-50", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Change location. Currently ${label}`}
        className={cn(
          "inline-flex h-11 max-w-full items-center gap-2 rounded-pill px-3.5 text-sm font-semibold transition-colors",
          tone === "hero"
            ? "text-foreground hover:bg-muted"
            : "border border-border bg-card text-foreground hover:border-primary/40",
        )}
      >
        <MapPin className="size-4 shrink-0 text-primary-strong" aria-hidden="true" />
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={panelId}
          className={cn(
            "absolute z-50 mt-2 flex w-76 flex-col overflow-hidden rounded-card border border-border bg-card shadow-lift",
            // One bounded scroll region for the whole panel rather than a
            // nested scroller on the city list — capped against the viewport
            // so it cannot run off the bottom of a short screen.
            "max-h-[min(30rem,70vh)]",
            // Flips to the right edge so the panel never leaves the viewport
            // when the trigger sits in the header's right cluster.
            tone === "hero" ? "left-0" : "right-0",
          )}
        >
          <div className="shrink-0 border-b border-border px-4 py-3">
            <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Select city
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ul className="p-1.5">
              {cities.map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    disabled={!city.available}
                    onClick={() => {
                      dispatch(setCity(city.id));
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-control px-3 py-2.5 text-left text-sm transition-colors",
                      city.available
                        ? "hover:bg-muted"
                        : "cursor-not-allowed text-muted-foreground/70",
                    )}
                  >
                    <span className="font-semibold">{city.name}</span>
                    {city.available ? (
                      city.id === cityId ? (
                        <Check className="size-4 text-primary-strong" aria-hidden="true" />
                      ) : null
                    ) : (
                      <span className="text-[0.6875rem] font-semibold tracking-wide text-muted-foreground/80 uppercase">
                        Coming soon
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {activeCity.localities.length > 0 ? (
              <div className="border-t border-border">
                <p className="px-4 pt-3 pb-2 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  Popular localities
                </p>
                <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                  <LocalityChip
                    label={`All of ${activeCity.name}`}
                    active={locality === null}
                    onClick={() => {
                      dispatch(setLocality(null));
                      setOpen(false);
                    }}
                  />
                  {activeCity.localities.slice(0, 8).map((item) => (
                    <LocalityChip
                      key={item}
                      label={item}
                      active={locality === item}
                      onClick={() => {
                        dispatch(setLocality(item));
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LocalityChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-pill border px-2.5 py-1 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
