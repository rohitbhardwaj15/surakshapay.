import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Async Thunks ────────────────────────────────────────────────

export const fetchPolicy = createAsyncThunk(
  'policy/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getPolicy();
      return data.policy;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const activatePolicy = createAsyncThunk(
  'policy/activate',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.activatePolicy();
      return data.policy;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deactivatePolicy = createAsyncThunk(
  'policy/deactivate',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.deactivatePolicy();
      return data.policy;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────

const policySlice = createSlice({
  name: 'policy',
  initialState: {
    policy:  null,
    loading: false,
    error:   null,
    successMsg: null,
  },
  reducers: {
    setPolicy(state, action) {
      state.policy = action.payload;
    },
    clearPolicyMsg(state) {
      state.error      = null;
      state.successMsg = null;
    },
    resetPolicy(state) {
      state.policy     = null;
      state.loading    = false;
      state.error      = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchPolicy.pending, (state) => { state.loading = true; })
      .addCase(fetchPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policy  = action.payload;
      })
      .addCase(fetchPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // activate
    builder
      .addCase(activatePolicy.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(activatePolicy.fulfilled, (state, action) => {
        state.loading    = false;
        state.policy     = action.payload;
        state.successMsg = 'Policy activated! All 8 trigger types are now monitored.';
      })
      .addCase(activatePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // deactivate
    builder
      .addCase(deactivatePolicy.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deactivatePolicy.fulfilled, (state, action) => {
        state.loading    = false;
        state.policy     = action.payload;
        state.successMsg = 'Policy deactivated. Coverage has been paused.';
      })
      .addCase(deactivatePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { setPolicy, clearPolicyMsg, resetPolicy } = policySlice.actions;

// ── Selectors ───────────────────────────────────────────────────
export const selectPolicy        = (state) => state.policy.policy;
export const selectPolicyLoading = (state) => state.policy.loading;
export const selectPolicyError   = (state) => state.policy.error;
export const selectPolicySuccess = (state) => state.policy.successMsg;
export const selectIsActive      = (state) => state.policy.policy?.status === 'active';

export default policySlice.reducer;
