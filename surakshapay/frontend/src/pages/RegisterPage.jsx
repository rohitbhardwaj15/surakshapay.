import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, selectAuthLoading, selectAuthError, selectUser } from '../store/hooks.js';
import { registerUser, loginUser, clearError } from '../store/slices/authSlice.js';
import { setPolicy } from '../store/slices/policySlice.js';
import { showLanding } from '../store/slices/uiSlice.js';
import { Alert, Input, Select, FormField } from '../components/ui/index.jsx';

const CITIES    = ['Mumbai','Delhi','Bengaluru','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad'];
const PLATFORMS = ['Zepto','Blinkit','Swiggy','Zomato','Dunzo','BigBasket'];

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const loading  = useAppSelector(selectAuthLoading);
  const error    = useAppSelector(selectAuthError);
  const user     = useAppSelector(selectUser);

  const [mode, setMode] = useState('register'); // 'register' | 'login'

  const [form, setForm] = useState({ name:'', city:'', platform:'', weeklyIncome:'', hoursPerDay:'8', upiId:'', password:'' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const [loginForm, setLoginForm] = useState({ name:'', policyNumber:'', password:'' });
  const setLogin = (k) => (e) => setLoginForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.city || !form.platform || !form.weeklyIncome || !form.upiId || !form.password) return;
    dispatch(clearError());
    const result = await dispatch(registerUser({
      name: form.name, city: form.city, platform: form.platform,
      weeklyIncome: parseFloat(form.weeklyIncome),
      hoursPerDay:  parseFloat(form.hoursPerDay) || 8,
      upiId: form.upiId,
      password: form.password,
    }));
    // If register succeeded, also save policy into Redux
    if (result.payload?.policy) {
      dispatch(setPolicy(result.payload.policy));
    }
  };

  const handleLogin = async () => {
    if (!loginForm.name || !loginForm.policyNumber || !loginForm.password) return;
    dispatch(clearError());
    const result = await dispatch(loginUser(loginForm));
    if (result.payload?.policy) {
      dispatch(setPolicy(result.payload.policy));
    }
  };

  const coverage = form.weeklyIncome
    ? `Your coverage will be ₹${Math.round(parseFloat(form.weeklyIncome) * 0.7).toLocaleString('en-IN')} per claim (70%)`
    : 'Your coverage will be 70% of this amount per claim';

  return (
    <div>
      {!user && (
        <div
          onClick={() => dispatch(showLanding())}
          style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--text3)', cursor:'pointer', marginBottom:'16px', fontWeight:600, transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--violet2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><path d="M9 2L3 7l6 5" /></svg>
          Back to home
        </div>
      )}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', maxWidth:'860px' }}>

      {/* Left info panel */}
      <div style={{ padding:'40px 36px', borderRight:'1px solid var(--border)', background:'var(--bg)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' }}>
          <div style={{ width:40, height:40, background:'var(--violet)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg viewBox="0 0 18 18" fill="none" width="20" height="20"><path d="M9 1.5L2 5v5c0 3.9 2.97 7.55 7 8.5C13.03 17.55 16 13.9 16 10V5L9 1.5z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.2"/><path d="M6 9.5l2.2 2.2 4.2-5.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:700 }}>SurakshaPay</div>
            <div style={{ fontSize:'11px', color:'var(--text3)' }}>Insurtech Platform</div>
          </div>
        </div>

        <h2 style={{ fontSize:'24px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:'8px', lineHeight:1.2 }}>
          Your income,<br />protected automatically
        </h2>
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.65, marginBottom:'28px' }}>
          Join thousands of delivery partners who get instant payouts when weather or events disrupt their work.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:'11px', marginBottom:'28px' }}>
          {[['⚡','Instant claim processing — under 2 seconds'],['📄','Zero paperwork, zero documentation required'],['🛡️','AI-powered fraud protection on every claim'],['📈','70% income coverage per trigger event']].map(([icon, text]) => (
            <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'var(--text2)' }}>
              <div style={{ width:26, height:26, background:'var(--violet-bg)', border:'1px solid var(--violet-border)', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', flexShrink:0 }}>{icon}</div>
              {text}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'24px' }}>
          {[['< 2s','Payout time'],['70%','Coverage'],['8','Triggers']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center', padding:'14px 8px', background:'var(--bg2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:'18px', fontWeight:800, color:'var(--violet2)' }}>{v}</div>
              <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'3px' }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px 16px' }}>
          <div style={{ fontSize:'12px', color:'var(--gold)', fontWeight:700, marginBottom:'6px' }}>★★★★★</div>
          <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.6, fontStyle:'italic' }}>
            "I got paid within seconds after the heavy rain last Tuesday. No calls, no forms — just money in my account."
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ padding:'40px 36px' }}>
        {mode === 'register' ? (
          <>
            <h2 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:'6px' }}>Create your account</h2>
            <p style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'24px' }}>Get insured in under 60 seconds. No documents needed.</p>

            {error && <Alert message={error} type="err" onClose={() => dispatch(clearError())} />}

            <FormField label="Full name">
              <Input placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
            </FormField>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <FormField label="City">
                <Select value={form.city} onChange={set('city')}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </FormField>
              <FormField label="Platform">
                <Select value={form.platform} onChange={set('platform')}>
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </Select>
              </FormField>
            </div>

            <FormField label="Weekly income" hint={coverage}>
              <Input prefix="₹" type="number" placeholder="3500" min="100" value={form.weeklyIncome} onChange={set('weeklyIncome')} />
            </FormField>

            <FormField label="UPI ID">
              <Input placeholder="9876543210@upi" value={form.upiId} onChange={set('upiId')} />
            </FormField>

            <FormField label="Password" hint="At least 6 characters — you'll need this to log in later">
              <Input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
            </FormField>

            <button
              onClick={handleSubmit}
              disabled={loading || !form.name || !form.city || !form.platform || !form.weeklyIncome || !form.upiId || !form.password}
              style={{ width:'100%', padding:'13px', borderRadius:'var(--radius-sm)', background: loading ? 'var(--bg3)' : 'var(--violet)', color: loading ? 'var(--text3)' : '#fff', fontSize:'14px', fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s', fontFamily:'inherit', marginBottom:'12px', opacity: (!form.name||!form.city||!form.platform||!form.weeklyIncome||!form.upiId||!form.password) ? 0.6 : 1 }}
            >
              {loading ? 'Creating account...' : 'Get Protected →'}
            </button>

            <div style={{ textAlign:'center', fontSize:'12px', color:'var(--text3)' }}>
              Already registered?{' '}
              <span onClick={() => { dispatch(clearError()); setMode('login'); }} style={{ color:'var(--violet2)', cursor:'pointer', fontWeight:600 }}>
                Log in
              </span>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:'6px' }}>Welcome back</h2>
            <p style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'24px' }}>Log in with your name, policy number, and password.</p>

            {error && <Alert message={error} type="err" onClose={() => dispatch(clearError())} />}

            <FormField label="Full name">
              <Input placeholder="Rahul Sharma" value={loginForm.name} onChange={setLogin('name')} />
            </FormField>

            <FormField label="Policy number" hint="e.g. SPY-48213 — sent to you at registration">
              <Input placeholder="SPY-48213" value={loginForm.policyNumber} onChange={setLogin('policyNumber')} />
            </FormField>

            <FormField label="Password">
              <Input type="password" placeholder="••••••••" value={loginForm.password} onChange={setLogin('password')} />
            </FormField>

            <button
              onClick={handleLogin}
              disabled={loading || !loginForm.name || !loginForm.policyNumber || !loginForm.password}
              style={{ width:'100%', padding:'13px', borderRadius:'var(--radius-sm)', background: loading ? 'var(--bg3)' : 'var(--violet)', color: loading ? 'var(--text3)' : '#fff', fontSize:'14px', fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s', fontFamily:'inherit', marginBottom:'12px', opacity: (!loginForm.name||!loginForm.policyNumber||!loginForm.password) ? 0.6 : 1 }}
            >
              {loading ? 'Logging in...' : 'Log in →'}
            </button>

            <div style={{ textAlign:'center', fontSize:'12px', color:'var(--text3)' }}>
              New here?{' '}
              <span onClick={() => { dispatch(clearError()); setMode('register'); }} style={{ color:'var(--violet2)', cursor:'pointer', fontWeight:600 }}>
                Create an account
              </span>
            </div>
          </>
        )}

        <div style={{ textAlign:'center', marginTop:'10px', fontSize:'12px', color:'var(--text3)' }}>
          Claim notifications sent to <strong style={{ color:'var(--teal)' }}>claims@surakshapay.ai</strong>
        </div>
      </div>
    </div>
    </div>
  );
}
