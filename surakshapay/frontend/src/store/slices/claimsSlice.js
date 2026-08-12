import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Async Thunks ────────────────────────────────────────────────

export const fetchClaims = createAsyncThunk(
  'claims/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getClaims();
      return data.claims;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fireTrigger = createAsyncThunk(
  'claims/fireTrigger',
  async (triggerType, { rejectWithValue }) => {
    try {
      const data = await api.fireTrigger(triggerType);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────

const claimsSlice = createSlice({
  name: 'claims',
  initialState: {
    claims:      [],
    lastResult:  null,   // Full API response from fireTrigger
    loading:     false,
    firing:      false,  // Specifically for trigger animation
    error:       null,
  },
  reducers: {
    clearLastResult(state) {
      state.lastResult = null;
      state.error      = null;
    },
    resetClaims(state) {
      state.claims     = [];
      state.lastResult = null;
      state.loading    = false;
      state.firing     = false;
      state.error      = null;
    },
  },
  extraReducers: (builder) => {
    // fetchClaims
    builder
      .addCase(fetchClaims.pending, (state) => { state.loading = true; })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims  = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // fireTrigger
    builder
      .addCase(fireTrigger.pending, (state) => {
        state.firing     = true;
        state.error      = null;
        state.lastResult = null;
      })
      .addCase(fireTrigger.fulfilled, (state, action) => {
        state.firing     = false;
        state.lastResult = action.payload;
        // Prepend the new claim to the top of the list
        state.claims     = [action.payload.claim, ...state.claims];
      })
      .addCase(fireTrigger.rejected, (state, action) => {
        state.firing = false;
        state.error  = action.payload;
      });
  },
});

export const { clearLastResult, resetClaims } = claimsSlice.actions;

// ── Selectors ────────────────────────────────────────────────────
export const selectClaims       = (state) => state.claims.claims;
export const selectLastResult   = (state) => state.claims.lastResult;
export const selectClaimsLoading = (state) => state.claims.loading;
export const selectFiring       = (state) => state.claims.firing;
export const selectClaimsError  = (state) => state.claims.error;
export const selectTotalPaidOut = (state) =>
  state.claims.claims
    .filter((c) => c.status === 'approved')
    .reduce((s, c) => s + (c.payoutAmount || 0), 0);
export const selectApprovedCount = (state) =>
  state.claims.claims.filter((c) => c.status === 'approved').length;

export default claimsSlice.reducer;
