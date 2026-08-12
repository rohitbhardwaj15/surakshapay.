import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Async Thunks ────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.register(formData);
      api.setToken(data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.login(formData);
      api.setToken(data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = api.getToken();
      if (!token) throw new Error('No token');
      const data = await api.getDashboard();
      return data;
    } catch (err) {
      api.removeToken();
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    loading: false,
    error:   null,
    sessionRestored: false,
  },
  reducers: {
    logout(state) {
      api.removeToken();
      state.user    = null;
      state.error   = null;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // restore session
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user           = action.payload.user;
        state.sessionRestored = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user           = null;
        state.sessionRestored = true;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// ── Selectors ───────────────────────────────────────────────────
export const selectUser    = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;
export const selectSessionRestored = (state) => state.auth.sessionRestored;

export default authSlice.reducer;
