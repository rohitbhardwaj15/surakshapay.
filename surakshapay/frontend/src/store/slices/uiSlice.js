import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, restoreSession } from './authSlice';

// Controls which top-level view and which app page is shown

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    view: 'landing',    // 'landing' | 'app'
    page: 'register',   // 'register' | 'overview' | 'policy' | 'triggers' | 'claims' | 'fraud'
  },
  reducers: {
    setView(state, action) {
      state.view = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    showApp(state) {
      state.view = 'app';
    },
    showLanding(state) {
      state.view = 'landing';
      state.page = 'register';
    },
  },
  extraReducers: (builder) => {
    // After successful register → go to overview
    builder.addCase(registerUser.fulfilled, (state) => {
      state.view = 'app';
      state.page = 'overview';
    });

    // After successful login → go to overview
    builder.addCase(loginUser.fulfilled, (state) => {
      state.view = 'app';
      state.page = 'overview';
    });

    // After session restore → go to app if user found
    builder.addCase(restoreSession.fulfilled, (state) => {
      state.view = 'app';
      state.page = 'overview';
    });

    // If session restore fails → stay on landing
    builder.addCase(restoreSession.rejected, (state) => {
      state.view = 'landing';
      state.page = 'register';
    });
  },
});

export const { setView, setPage, showApp, showLanding } = uiSlice.actions;

// ── Selectors ───────────────────────────────────────────────────
export const selectView = (state) => state.ui.view;
export const selectPage = (state) => state.ui.page;

export default uiSlice.reducer;
