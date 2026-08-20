import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FavoritesState {
  /** Restaurant ids. */
  ids: string[];
  /**
   * Favourites are restored from `localStorage` after mount. Until that
   * happens the UI renders the empty state so server and client markup match.
   */
  hydrated: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  hydrated: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const index = state.ids.indexOf(action.payload);
      if (index === -1) {
        state.ids.push(action.payload);
      } else {
        state.ids.splice(index, 1);
      }
    },
    hydrateFavorites(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
      state.hydrated = true;
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, hydrateFavorites, clearFavorites } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
