"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import type { DashboardSession } from "@/data/dashboard-users";

import { hydrateSession } from "./features/auth/authSlice";
import { hydrateFavorites } from "./features/favorites/favoritesSlice";
import { hydrateTheme } from "./features/theme/themeSlice";
import { makeStore, type AppStore, type RootState } from "./store";
import { THEME_STORAGE_KEY, type StoredThemeState } from "./theme/apply";

const FAVORITES_KEY = "dineboard.favorites.v1";
const SESSION_KEY = "dineboard.session.v1";

/** Reads and parses a key, returning `null` for missing or corrupt values. */
function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // Private-mode Safari throws on access; a hand-edited value throws on
    // parse. Either way the caller falls back to defaults.
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state stays in memory for the session */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialiser: the store is created exactly once per client tree, and
  // unlike a ref it is safe to read during render.
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => {
    // Restore after mount rather than during render: reading localStorage on
    // the first pass would produce markup the server could not have generated.
    const storedFavorites = readJson<unknown>(FAVORITES_KEY);
    store.dispatch(
      hydrateFavorites(
        Array.isArray(storedFavorites)
          ? storedFavorites.filter((id): id is string => typeof id === "string")
          : [],
      ),
    );

    store.dispatch(hydrateTheme(readJson<StoredThemeState>(THEME_STORAGE_KEY)));
    store.dispatch(hydrateSession(readJson<DashboardSession>(SESSION_KEY)));

    /**
     * Persist on change.
     *
     * Each slice is compared by reference before writing — Redux Toolkit gives
     * new references only when something actually changed, so a scroll or a
     * filter toggle never triggers a `localStorage` write.
     */
    let previous = store.getState();

    const unsubscribe = store.subscribe(() => {
      const next: RootState = store.getState();

      if (next.favorites.ids !== previous.favorites.ids) {
        writeJson(FAVORITES_KEY, next.favorites.ids);
      }

      if (
        next.theme.themes !== previous.theme.themes ||
        next.theme.activeThemeId !== previous.theme.activeThemeId
      ) {
        writeJson(THEME_STORAGE_KEY, {
          activeThemeId: next.theme.activeThemeId,
          themes: next.theme.themes,
        } satisfies StoredThemeState);
      }

      if (next.auth.session !== previous.auth.session) {
        if (next.auth.session) writeJson(SESSION_KEY, next.auth.session);
        else {
          try {
            window.localStorage.removeItem(SESSION_KEY);
          } catch {
            /* nothing to clean up */
          }
        }
      }

      previous = next;
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
