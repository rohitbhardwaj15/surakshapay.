import { configureStore } from '@reduxjs/toolkit';
import authReducer   from './slices/authSlice';
import policyReducer from './slices/policySlice';
import claimsReducer from './slices/claimsSlice';
import uiReducer     from './slices/uiSlice';
import adminReducer  from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth:   authReducer,
    policy: policyReducer,
    claims: claimsReducer,
    ui:     uiReducer,
    admin:  adminReducer,
  },
  // Redux Toolkit enables Redux DevTools Extension automatically in development
  devTools: import.meta.env.DEV,
});

export default store;
