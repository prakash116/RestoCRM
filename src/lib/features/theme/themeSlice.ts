import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { CUSTOM_THEME_SLUGS, builtInThemes, defaultThemeState } from "@/data/themes";
import type { StoredThemeState, ThemeDefinition } from "@/lib/theme/apply";
import type { ThemeColors, ThemeTokenName } from "@/lib/theme/tokens";

export interface ThemeState extends StoredThemeState {
  /** False until `localStorage` has been read after mount. */
  hydrated: boolean;
}

const initialState: ThemeState = { ...defaultThemeState(), hydrated: false };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /** Makes a theme the one the public site renders. */
    activateTheme(state, action: PayloadAction<string>) {
      if (state.themes.some((theme) => theme.id === action.payload)) {
        state.activeThemeId = action.payload;
      }
    },

    /** Writes one colour token. The editor calls this on every input change. */
    setThemeColor(
      state,
      action: PayloadAction<{ themeId: string; token: ThemeTokenName; value: string }>,
    ) {
      const theme = state.themes.find((candidate) => candidate.id === action.payload.themeId);
      if (theme) theme.colors[action.payload.token] = action.payload.value;
    },

    renameTheme(state, action: PayloadAction<{ themeId: string; name: string }>) {
      const theme = state.themes.find((candidate) => candidate.id === action.payload.themeId);
      // An empty name would leave an unlabelled row in the theme list.
      const name = action.payload.name.trim();
      if (theme && name) theme.name = name;
    },

    /** Restores a built-in theme to its shipped palette. */
    resetTheme(state, action: PayloadAction<string>) {
      const theme = state.themes.find((candidate) => candidate.id === action.payload);
      const original = builtInThemes.find((candidate) => candidate.id === action.payload);
      if (theme && original) theme.colors = { ...original.colors };
    },

    /**
     * Creates a theme in the next free reserved slot, seeded from an existing
     * palette so the editor never opens on undefined colours.
     */
    createTheme(
      state,
      action: PayloadAction<{ name: string; seedFromThemeId: string }>,
    ) {
      const used = new Set(state.themes.map((theme) => theme.slug));
      const slug = CUSTOM_THEME_SLUGS.find((candidate) => !used.has(candidate));
      if (!slug) return;

      const seed =
        state.themes.find((theme) => theme.id === action.payload.seedFromThemeId) ?? state.themes[0];

      state.themes.push({
        id: slug,
        slug,
        name: action.payload.name.trim() || "Untitled theme",
        description: `Created in the dashboard, based on ${seed.name}.`,
        builtIn: false,
        colors: { ...seed.colors },
      });
    },

    deleteTheme(state, action: PayloadAction<string>) {
      const theme = state.themes.find((candidate) => candidate.id === action.payload);
      if (!theme || theme.builtIn) return;

      state.themes = state.themes.filter((candidate) => candidate.id !== action.payload);
      // Never leave the site pointing at a theme that no longer exists.
      if (state.activeThemeId === action.payload) {
        state.activeThemeId = state.themes[0]?.id ?? "indigo";
      }
    },

    /**
     * Merges persisted state over the shipped defaults.
     *
     * Built-ins are matched by id so a palette edited in a previous session is
     * restored, while any token added to the schema since then falls back to
     * its shipped value instead of arriving `undefined`.
     */
    hydrateTheme(state, action: PayloadAction<StoredThemeState | null>) {
      state.hydrated = true;
      const stored = action.payload;
      if (!stored?.themes?.length) return;

      const base = defaultThemeState();
      const merged: ThemeDefinition[] = base.themes.map((shipped) => {
        const saved = stored.themes.find((theme) => theme.id === shipped.id);
        if (!saved) return shipped;
        return {
          ...shipped,
          name: saved.name || shipped.name,
          colors: { ...shipped.colors, ...saved.colors } as ThemeColors,
        };
      });

      for (const saved of stored.themes) {
        const isCustomSlot = (CUSTOM_THEME_SLUGS as readonly string[]).includes(saved.id);
        if (!isCustomSlot || merged.some((theme) => theme.id === saved.id)) continue;
        merged.push({
          ...saved,
          builtIn: false,
          colors: { ...base.themes[0].colors, ...saved.colors } as ThemeColors,
        });
      }

      state.themes = merged;
      state.activeThemeId = merged.some((theme) => theme.id === stored.activeThemeId)
        ? stored.activeThemeId
        : base.activeThemeId;
    },
  },
});

export const {
  activateTheme,
  setThemeColor,
  renameTheme,
  resetTheme,
  createTheme,
  deleteTheme,
  hydrateTheme,
} = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
