"use client";

import { useLayoutEffect } from "react";

import { useAppSelector } from "@/lib/hooks";
import { applyTheme, getThemeColors } from "@/lib/theme/apply";

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
  const activeMode = useAppSelector((state) => state.theme.activeMode);
  const hydrated = useAppSelector((state) => state.theme.hydrated);

  useLayoutEffect(() => {
    // The blocking head script owns the pre-hydration paint. Applying Redux's
    // server snapshot here would briefly overwrite a saved palette with Indigo.
    if (hydrated && activeTheme) {
      applyTheme(activeTheme, activeMode);

      let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!themeColor) {
        themeColor = document.createElement("meta");
        themeColor.name = "theme-color";
        document.head.append(themeColor);
      }
      themeColor.content = getThemeColors(activeTheme, activeMode).background;
    }
  }, [activeMode, activeTheme, hydrated]);

  return null;
}
