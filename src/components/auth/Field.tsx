"use client";

import { useId } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Labelled form control.
 *
 * The label is always a real `<label htmlFor>` — placeholder-only fields lose
 * their name the moment the user starts typing, which breaks both screen
 * readers and anyone reviewing a half-filled form.
 */
export function Field({
  label,
  type = "text",
  placeholder,
  hint,
  required = false,
  autoComplete,
  inputMode,
  className,
}: {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={hint ? hintId : undefined}
        className={cn(
          "h-12 w-full rounded-control border border-input bg-card px-4 text-[0.9375rem] text-foreground",
          "placeholder:text-muted-foreground/70",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        )}
      />

      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
