import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_CITY_ID, cities } from "@/data/cities";

export interface LocationState {
  cityId: string;
  cityName: string;
  /** `null` means "anywhere in the selected city". */
  locality: string | null;
  /** Set once the browser geolocation prompt has been answered. */
  detectionState: "idle" | "detecting" | "granted" | "denied";
}

const defaultCity = cities.find((city) => city.id === DEFAULT_CITY_ID) ?? cities[0];

const initialState: LocationState = {
  cityId: defaultCity.id,
  cityName: defaultCity.name,
  locality: null,
  detectionState: "idle",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      const city = cities.find((candidate) => candidate.id === action.payload);
      if (!city || !city.available) return;
      state.cityId = city.id;
      state.cityName = city.name;
      // A locality from the previous city would be meaningless here.
      state.locality = null;
    },
    setLocality(state, action: PayloadAction<string | null>) {
      state.locality = action.payload;
    },
    setDetectionState(state, action: PayloadAction<LocationState["detectionState"]>) {
      state.detectionState = action.payload;
    },
  },
});

export const { setCity, setLocality, setDetectionState } = locationSlice.actions;
export const locationReducer = locationSlice.reducer;
