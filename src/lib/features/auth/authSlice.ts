import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { DashboardSession } from "@/data/dashboard-users";

export interface AuthState {
  session: DashboardSession | null;
  /**
   * False until the persisted session has been read after mount. The guard
   * shows a loading state rather than bouncing to the login page, which would
   * otherwise flash on every refresh of a signed-in dashboard.
   */
  hydrated: boolean;
}

const initialState: AuthState = { session: null, hydrated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<DashboardSession>) {
      state.session = action.payload;
    },
    signOut(state) {
      state.session = null;
    },
    hydrateSession(state, action: PayloadAction<DashboardSession | null>) {
      state.session = action.payload;
      state.hydrated = true;
    },
  },
});

export const { signIn, signOut, hydrateSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
