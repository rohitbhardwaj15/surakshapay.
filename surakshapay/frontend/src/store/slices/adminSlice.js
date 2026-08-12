import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [stats, alerts, zones] = await Promise.all([
        api.getAdminStats(),
        api.getFraudAlerts(),
        api.getZoneRisk(),
      ]);
      return { stats: stats.stats, weeklyChart: stats.weeklyChart, riskTrend: stats.riskTrend, alerts: alerts.alerts, zones: zones.zones };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats:       null,
    weeklyChart: null,
    riskTrend:   null,
    alerts:      [],
    zones:       [],
    loading:     false,
    error:       null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading     = false;
        state.stats       = action.payload.stats;
        state.weeklyChart = action.payload.weeklyChart;
        state.riskTrend   = action.payload.riskTrend;
        state.alerts      = action.payload.alerts;
        state.zones       = action.payload.zones;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const selectAdminStats   = (state) => state.admin.stats;
export const selectWeeklyChart  = (state) => state.admin.weeklyChart;
export const selectRiskTrend    = (state) => state.admin.riskTrend;
export const selectFraudAlerts  = (state) => state.admin.alerts;
export const selectZones        = (state) => state.admin.zones;
export const selectAdminLoading = (state) => state.admin.loading;

export default adminSlice.reducer;
