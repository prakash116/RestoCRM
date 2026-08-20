"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { hydrateFavorites } from "./features/favorites/favoritesSlice";
import { makeStore } from "./store";

const FAVORITES_KEY = "dineboard.favorites.v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialiser: the store is created exactly once per client tree, and
  // unlike a ref it is safe to read during render.
  const [store] = useState(makeStore);

  useEffect(() => {
    // Restore after mount rather than during render: reading localStorage on
    // the first pass would produce markup the server could not have generated.
    try {
      const stored = window.localStorage.getItem(FAVORITES_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      const ids = Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [];
      store.dispatch(hydrateFavorites(ids));
    } catch {
      // Private-mode Safari and disabled storage both throw here. Favourites
      // simply stay in memory for the session.
      store.dispatch(hydrateFavorites([]));
    }

    let previous = store.getState().favorites.ids;
    const unsubscribe = store.subscribe(() => {
      const next = store.getState().favorites.ids;
      if (next === previous) return;
      previous = next;
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — non-fatal */
      }
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
