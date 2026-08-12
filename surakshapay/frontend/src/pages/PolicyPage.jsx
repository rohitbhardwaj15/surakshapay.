import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector, selectUser, selectPolicy, selectIsActive, selectPolicyLoading, selectPolicyError, selectPolicySuccess } from '../store/hooks.js';
import { activatePolicy, deactivatePolicy, fetchPolicy, clearPolicyMsg } from '../store/slices/policySlice.js';
import { fmt } from '../utils/helpers.js';
import { Alert } from '../components/ui/index.jsx';

const COVERED = [
  ['🌧️','Heavy Rain','≥ 50mm/hr'],['🌫️','High AQI','AQI ≥ 300'],
  ['🌡️','Heatwave','Temp ≥ 42°C'],['🚫','Curfew','Govt declared'],
  ['🌊','Flood','Local flood advisory'],['🌀','Cyclone','State cyclone warning'],
  ['🌫','Dense Fog','Visibility < 50m'],['⛔','Bandh/Riot','District shutdown'],
];

export default function PolicyPage() {
  const dispatch  = useAppDispatch();
  const user      = useAppSelector(selectUser);
  const policy    = useAppSelector(selectPolicy);
  const isActive  = useAppSelector(selectIsActive);
  const loading   = useAppSelector(selectPolicyLoading);
  const error     = useAppSelector(selectPolicyError);
  const success   = useAppSelector(selectPolicySuccess);

  useEffect(() => {
    if (!policy) dispatch(fetchPolicy());
  }, []);

  if (!user) return null;

  return (
    <div>
      {error   && <Alert message={error}   type="err"  onClose={() => dispatch(clearPolicyMsg())} />}
      {success && <Alert message={success} type="ok"   onClose={() => dispatch(clearPolicyMsg())} />}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'16px' }}>
        {/* Left: premium breakdown */}
        <div>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'18px 22px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:36, height:36, background:'var(--bg3)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>🔒</div>
              <div>
                <div style={{ fontSize:'14px', fontWeight:700 }}>Premium Breakdown</div>
                <div style={{ fontSize:'12px', color:'var(--text3)' }}>How your premium is calculated</div>
              </div>
            </div>
            <div style={{ padding:'18px 22px' }}>
              {[
                ['Weekly Income', fmt(user.weeklyIncome)],
                ['Base Rate', '5.00%'],
                ['Risk Score', `${user.riskScore?.toFixed(2)} (${user.riskLabel})`],
                ['Risk Multiplier', `× ${(1 + (user.riskScore || 0)).toFixed(2)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'14px' }}>
                  <span style={{ color:'var(--text2)' }}>{k}</span>
                  <span style={{ fontWeight:700, color: k === 'Risk Score' ? (user.riskScore < 0.35 ? 'var(--teal)' : user.riskScore < 0.65 ? 'var(--gold)' : 'var(--rose)') : 'var(--text)' }}>{v}</span>
                </div>
              ))}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px' }}>
                <div style={{ background:'var(--bg3)', borderRadius:'var(--radius-sm)', padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px' }}>Weekly Premium</div>
                  <div style={{ fontSize:'26px', fontWeight:900, letterSpacing:'-0.5px', color:'var(--violet2)' }}>{fmt(user.weeklyPremium)}</div>
                  <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'3px' }}>per week</div>
                </div>
                <div style={{ background:'var(--bg3)', borderRadius:'var(--radius-sm)', padding:'14px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'6px' }}>Coverage</div>
                  <div style={{ fontSize:'26px', fontWeight:900, letterSpacing:'-0.5px', color:'var(--teal)' }}>{fmt(user.coverageAmount)}</div>
                  <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'3px' }}>per claim</div>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'13px 16px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', marginTop:'16px', fontSize:'12px', color:'var(--text2)', lineHeight:1.6 }}>
                <span style={{ color:'var(--text3)', flexShrink:0 }}>ℹ</span>
                Premium = Weekly Income × 5% × (1 + Risk Score). Higher risk scores reflect delivery frequency and location volatility.
              </div>
            </div>
          </div>

          {/* Covered events */}
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'14px', fontWeight:700 }}>Covered Events</div>
              <div style={{ fontSize:'12px', color:'var(--text3)' }}>8 events</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' }}>
              {COVERED.map(([icon, label, sub]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'9px', padding:'11px 13px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', fontSize:'13px', fontWeight:500 }}>
                  <span style={{ fontSize:'17px' }}>{icon}</span>
                  <div><div style={{ fontWeight:600 }}>{label}</div><div style={{ fontSize:'11px', color:'var(--text3)' }}>{sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: activation */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px', height:'fit-content' }}>
          <div style={{ fontSize:'14px', fontWeight:700, marginBottom:'16px' }}>Policy Activation</div>
          <div style={{ padding:'14px 16px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              {isActive ? (
                <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--teal-bg)', border:'1px solid var(--teal-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--teal)', fontSize:'12px', flexShrink:0 }}>✓</div>
              ) : (
                <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--rose-bg)', border:'1px solid var(--rose-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--rose)', fontSize:'12px', flexShrink:0 }}>✕</div>
              )}
              <div>
                <div style={{ fontSize:'14px', fontWeight:700 }}>{isActive ? 'Active' : 'Inactive'}</div>
                <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'2px' }}>
                  {isActive ? 'Coverage running. All 8 triggers monitored.' : 'Activate to start receiving coverage for weather and event triggers.'}
                </div>
              </div>
            </div>
          </div>

          {!isActive ? (
            <button
              onClick={() => dispatch(activatePolicy())}
              disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'14px', fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', transition:'all 0.2s', marginBottom:'8px', fontFamily:'inherit', opacity: loading ? 0.7 : 1 }}
            >
              ⚡ {loading ? 'Activating...' : 'Activate Policy'}
            </button>
          ) : (
            <button
              onClick={() => dispatch(deactivatePolicy())}
              disabled={loading}
              style={{ width:'100%', padding:'11px', borderRadius:'var(--radius-sm)', background:'transparent', color:'var(--rose)', fontSize:'13px', fontWeight:600, border:'1px solid var(--rose-border)', cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s', fontFamily:'inherit', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Deactivating...' : 'Deactivate Policy'}
            </button>
          )}
          <div style={{ fontSize:'12px', color:'var(--text3)', textAlign:'center', marginTop:'6px' }}>
            {isActive ? 'Deactivating will pause your coverage immediately.' : `Activating charges ${fmt(user.weeklyPremium)}/week.`}
          </div>
        </div>
      </div>
    </div>
  );
}
