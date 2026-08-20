"use client";

import { useLayoutEffect } from "react";

import { useAppSelector } from "@/lib/hooks";
import { applyThemeColors } from "@/lib/theme/apply";

/**
 * Keeps `:root` in step with the active theme.
 *
 * Two things paint the theme, and both are needed:
 *
 * 1. The blocking script in `<head>` applies the saved palette while the HTML
 *    is still parsing, so there is no flash of the shipped colours.
 * 2. This component re-applies on every store change, which covers edits made
 *    live in the dashboard, theme switching, and React Strict Mode's dev
 *    remount — which resets the `<html>` attributes the script had set.
 *
 * `useLayoutEffect` rather than `useEffect`: it runs before paint, so a colour
 * change never shows the previous palette for a frame.
 */
export function ThemeApplier() {
  const activeTheme = useAppSelector((state) =>
    state.theme.themes.find((theme) => theme.id === state.theme.activeThemeId),
  );

  const colors = activeTheme?.colors;

  useLayoutEffect(() => {
    if (colors) applyThemeColors(colors);
  }, [colors]);

  return null;
}
