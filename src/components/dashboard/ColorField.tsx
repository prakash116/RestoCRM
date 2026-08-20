"use client";

import { useId, useState } from "react";

import { normalizeHex } from "@/lib/theme/contrast";
import type { ThemeTokenDef } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * One editable colour token.
 *
 * The swatch and the hex box edit the same value from opposite directions: the
 * native picker always produces a valid colour and commits immediately, while
 * the text box lets you paste a brand hex and only commits once it parses.
 * Keeping a local draft means a half-typed `#63` never blanks the site.
 */
export function ColorField({
  token,
  value,
  onChange,
}: {
  token: ThemeTokenDef;
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  // Follow external changes — resetting a theme or switching tokens must not
  // leave a stale string in the box. Adjusted during render rather than in an
  // effect so the field never paints the previous colour for a frame.
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) {
    setLastValue(value);
    setDraft(value);
  }

  const parsed = normalizeHex(draft);
  const invalid = parsed === null;

  function commit(next: string) {
    setDraft(next);
    const normalized = normalizeHex(next);
    if (normalized) onChange(normalized);
  }

  return (
    <div className="flex items-start gap-3 rounded-control border border-border bg-card p-3">
      <label className="relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-control border border-border">
        <span className="sr-only">{token.label} colour picker</span>
        <input
          type="color"
          value={parsed ?? value}
          onChange={(event) => commit(event.target.value)}
          // The native swatch is unstyleable; scaling an oversized input fills
          // the tile edge to edge in every engine.
          className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer border-0 bg-transparent p-0"
        />
      </label>

      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="block text-sm font-semibold text-foreground">
          {token.label}
        </label>
        <p id={hintId} className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {token.description}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <input
            id={inputId}
            type="text"
            spellCheck={false}
            value={draft}
            onChange={(event) => commit(event.target.value)}
            onBlur={() => setDraft(parsed ?? value)}
            aria-describedby={hintId}
            aria-invalid={invalid}
            className={cn(
              "h-9 w-28 rounded-control border bg-card px-2.5 font-mono text-xs text-foreground uppercase",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
              invalid ? "border-danger" : "border-input focus:border-primary",
            )}
          />
          <code className="truncate font-mono text-[0.6875rem] text-muted-foreground">
            --{token.name}
          </code>
        </div>

        {invalid ? (
          <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
            Enter a hex colour such as #6379c2.
          </p>
        ) : null}
      </div>
    </div>
  );
}
