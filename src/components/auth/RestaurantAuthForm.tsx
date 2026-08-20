"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { Field } from "./Field";

/**
 * Restaurant console sign-in and onboarding forms.
 *
 * The fields are real and validate through the browser, but nothing is
 * transmitted: this build has no auth service behind it. Rather than fake a
 * success screen, submitting explains what is not connected yet and points at
 * the partnerships team — a fake "logged in" state would mislead anyone
 * evaluating the product.
 */
export function RestaurantAuthForm({ mode }: { mode: "login" | "register" }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      {mode === "register" ? (
        <>
          <Field
            label="Restaurant name"
            placeholder="Copper Tandoor"
            required
            autoComplete="organization"
          />
          <Field
            label="Owner or manager name"
            placeholder="Your full name"
            required
            autoComplete="name"
          />
          <Field
            label="Work email"
            type="email"
            placeholder="you@restaurant.com"
            required
            autoComplete="email"
          />
          <Field
            label="Phone"
            type="tel"
            placeholder="+91 98xxx xxxxx"
            required
            autoComplete="tel"
            inputMode="tel"
            hint="We call once to confirm your outlets before listing goes live."
          />
          <Field
            label="Primary locality"
            placeholder="Connaught Place"
            required
            hint="Where your first outlet operates."
          />
        </>
      ) : (
        <>
          <Field
            label="Work email"
            type="email"
            placeholder="you@restaurant.com"
            required
            autoComplete="email"
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </>
      )}

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow] duration-200 hover:bg-primary-strong hover:shadow-glow"
      >
        {mode === "register" ? "Request onboarding" : "Sign in to console"}
      </button>

      {submitted ? (
        <p
          role="status"
          className="flex items-start gap-2.5 rounded-control border border-warning/25 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            The restaurant console is not connected in this build, so nothing was submitted. Email{" "}
            <a href="mailto:partners@dineboard.in" className="rounded-sm font-semibold underline">
              partners@dineboard.in
            </a>{" "}
            and the team will take it from here.
          </span>
        </p>
      ) : null}
    </form>
  );
}
