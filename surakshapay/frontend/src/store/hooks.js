import { useDispatch, useSelector } from 'react-redux';

// Pre-typed hooks — use these instead of plain useSelector/useDispatch
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// ── Re-export all selectors for convenience ──────────────────────
export {
  selectUser, selectAuthLoading, selectAuthError, selectSessionRestored,
} from './slices/authSlice';

export {
  selectPolicy, selectPolicyLoading, selectPolicyError,
  selectPolicySuccess, selectIsActive,
} from './slices/policySlice';

export {
  selectClaims, selectLastResult, selectClaimsLoading,
  selectFiring, selectClaimsError, selectTotalPaidOut, selectApprovedCount,
} from './slices/claimsSlice';

export {
  selectView, selectPage,
} from './slices/uiSlice';

export {
  selectAdminStats, selectWeeklyChart, selectRiskTrend,
  selectFraudAlerts, selectZones, selectAdminLoading,
} from './slices/adminSlice';
