import { configureStore } from "@reduxjs/toolkit";

import { favoritesReducer } from "./features/favorites/favoritesSlice";
import { locationReducer } from "./features/location/locationSlice";
import { restaurantsReducer } from "./features/restaurants/restaurantsSlice";

/**
 * A factory — never a module-level singleton.
 *
 * On the server a shared store would leak one visitor's filters and
 * favourites into another's request. `StoreProvider` calls this once per
 * client tree instead.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      location: locationReducer,
      restaurants: restaurantsReducer,
      favorites: favoritesReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
