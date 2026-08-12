import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, selectView, selectPage, selectSessionRestored } from './store/hooks.js';
import { restoreSession } from './store/slices/authSlice.js';
import { setPolicy } from './store/slices/policySlice.js';
import { resetClaims } from './store/slices/claimsSlice.js';
import { setView, setPage } from './store/slices/uiSlice.js';
import { Loader } from './components/ui/index.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AppShell from './components/layout/AppShell.jsx';
import api from './utils/api.js';

export default function App() {
  const dispatch         = useAppDispatch();
  const view             = useAppSelector(selectView);
  const page             = useAppSelector(selectPage);
  const sessionRestored  = useAppSelector(selectSessionRestored);
  const [booting, setBooting] = useState(true);
  const isPopping = useRef(false);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      // Try to restore session from saved JWT
      dispatch(restoreSession()).then((action) => {
        if (action.payload?.policy) {
          dispatch(setPolicy(action.payload.policy));
        }
        if (action.payload?.recentClaims) {
          // Pre-populate claims from dashboard response
          dispatch({ type: 'claims/fetchAll/fulfilled', payload: action.payload.recentClaims });
        }
        setBooting(false);
      });
    } else {
      setBooting(false);
    }
  }, [dispatch]);

  // ── Browser back/forward support ─────────────────────────────
  // This SPA has no react-router — it switches screens purely via Redux
  // state, so the URL never changes. Without this, the browser Back
  // button does nothing (or exits the site). We manually mirror
  // view/page into the History API so Back/Forward work as expected.
  useEffect(() => {
    window.history.replaceState({ view: 'landing', page: 'register' }, '');
  }, []);

  useEffect(() => {
    if (isPopping.current) { isPopping.current = false; return; }
    window.history.pushState({ view, page }, '');
  }, [view, page]);

  useEffect(() => {
    function onPopState(e) {
      isPopping.current = true;
      const state = e.state || { view: 'landing', page: 'register' };
      dispatch(setView(state.view));
      dispatch(setPage(state.page));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [dispatch]);

  if (booting) return <Loader />;
  if (view === 'landing') return <LandingPage />;
  return <AppShell />;
}
