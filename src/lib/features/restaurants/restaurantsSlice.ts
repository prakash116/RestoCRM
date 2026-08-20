import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Client-side discovery filters only.
 *
 * The restaurant records themselves are server-rendered and passed down as
 * props — putting them in Redux would ship the whole catalogue to the browser
 * twice and defeat streaming.
 */

export type SortOption = "relevance" | "rating" | "distance" | "cost-low" | "cost-high";

export interface RestaurantFiltersState {
  /** Cuisine slug, or `"all"`. */
  cuisine: string;
  /** Diet filter driven by the "Pure Veg" / "Non-Veg" chips. */
  diet: "all" | "veg" | "non-veg";
  sort: SortOption;
  /** Free-text query shared between the hero search and the listing page. */
  query: string;
  openNowOnly: boolean;
  offersOnly: boolean;
}

const initialState: RestaurantFiltersState = {
  cuisine: "all",
  diet: "all",
  sort: "relevance",
  query: "",
  openNowOnly: false,
  offersOnly: false,
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setCuisine(state, action: PayloadAction<string>) {
      state.cuisine = action.payload;
    },
    setDiet(state, action: PayloadAction<RestaurantFiltersState["diet"]>) {
      state.diet = action.payload;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    toggleOpenNow(state) {
      state.openNowOnly = !state.openNowOnly;
    },
    toggleOffersOnly(state) {
      state.offersOnly = !state.offersOnly;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCuisine,
  setDiet,
  setSort,
  setQuery,
  toggleOpenNow,
  toggleOffersOnly,
  resetFilters,
} = restaurantsSlice.actions;

export const restaurantsReducer = restaurantsSlice.reducer;
