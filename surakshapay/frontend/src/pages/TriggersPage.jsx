import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, selectIsActive, selectFiring, selectLastResult, selectClaimsError } from '../store/hooks.js';
import { fireTrigger, clearLastResult } from '../store/slices/claimsSlice.js';
import { setPage } from '../store/slices/uiSlice.js';
import { fmt, delay } from '../utils/helpers.js';
import { Alert } from '../components/ui/index.jsx';

const TRIGGERS = [
  { id:'Rain',      label:'Heavy Rain',   sub:'Rainfall disrupting deliveries',         icon:'🌧️', ibg:'rgba(74,158,255,0.12)',  ibr:'rgba(74,158,255,0.2)' },
  { id:'AQI',       label:'High AQI',     sub:'Hazardous air quality levels',            icon:'🌫️', ibg:'var(--violet-bg)',        ibr:'var(--violet-border)' },
  { id:'Heatwave',  label:'Heatwave',     sub:'Extreme heat above 42°C',                icon:'🌡️', ibg:'var(--gold-bg)',          ibr:'var(--gold-border)' },
  { id:'Curfew',    label:'Curfew',       sub:'Government curfew or city strike',        icon:'🚫', ibg:'var(--rose-bg)',          ibr:'var(--rose-border)' },
  { id:'Flood',     label:'Flood',        sub:'Waterlogging blocking road access',       icon:'🌊', ibg:'var(--teal-bg)',          ibr:'var(--teal-border)' },
  { id:'Cyclone',   label:'Cyclone',      sub:'Cyclonic storm or severe wind alert',     icon:'🌀', ibg:'rgba(74,158,255,0.08)',   ibr:'rgba(74,158,255,0.15)' },
  { id:'Dense Fog', label:'Dense Fog',    sub:'Visibility below safe riding threshold',  icon:'🌫', ibg:'rgba(255,255,255,0.04)', ibr:'rgba(255,255,255,0.08)' },
  { id:'Bandh',     label:'Bandh / Riot', sub:'Civil unrest or city-wide shutdown',      icon:'⛔', ibg:'var(--rose-bg)',          ibr:'var(--rose-border)' },
];

const STEPS = ['Trigger detected', 'Validating data', 'AI fraud analysis', 'Decision engine', 'UPI payout'];

export default function TriggersPage() {
  const dispatch   = useAppDispatch();
  const isActive   = useAppSelector(selectIsActive);
  const firing     = useAppSelector(selectFiring);
  const lastResult = useAppSelector(selectLastResult);
  const apiError   = useAppSelector(selectClaimsError);

  const [localAlert, setLocalAlert] = useState('');
  const [step, setStep]             = useState(-1);   // -1 = idle
  const [animDone, setAnimDone]     = useState(false);

  const handleFire = async (triggerType) => {
    if (firing) return;

    if (!isActive) {
      setLocalAlert('🔒 Activate your policy before filing a claim.');
      return;
    }

    setLocalAlert('');
    dispatch(clearLastResult());
    setStep(0);
    setAnimDone(false);

    // Animate steps 1–4 before API resolves
    for (let i = 1; i <= 4; i++) {
      await delay(700);
      setStep(i);
    }

    // Fire the Redux thunk (calls backend)
    await dispatch(fireTrigger(triggerType));

    // Step 5 — show final result
    setStep(5);
    setAnimDone(true);
  };

  const stepState = (i) => {
    if (step === -1) return 'idle';
    if (animDone)    return i < 5 ? 'done' : lastResult?.claim?.status === 'approved' ? 'done' : 'fail';
    if (i < step)    return 'done';
    if (i === step)  return 'live';
    return 'idle';
  };

  const dotStyle = (s) => ({
    width:24, height:24, borderRadius:'50%', flexShrink:0, zIndex:1,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'10px', fontWeight:700, transition:'all 0.3s',
    ...(s === 'done' ? { background:'rgba(0,200,150,0.15)', border:'2px solid var(--teal)',    color:'var(--teal)' }
      : s === 'live' ? { background:'rgba(107,92,231,0.15)', border:'2px solid var(--violet2)', color:'var(--violet2)', animation:'pipeLive 1.2s infinite' }
      : s === 'fail' ? { background:'var(--rose-bg)',        border:'2px solid var(--rose)',    color:'var(--rose)' }
      :                { background:'var(--bg3)',             border:'2px solid rgba(255,255,255,0.1)', color:'var(--text3)' }),
  });

  const ok = lastResult?.claim?.status === 'approved';

  return (
    <div>
      {localAlert && <Alert message={localAlert} type="warn" onClose={() => setLocalAlert('')} />}
      {apiError   && <Alert message={apiError}   type="err"  onClose={() => dispatch(clearLastResult())} />}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'16px' }}>

        {/* Left: trigger grid */}
        <div>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'14px' }}>
            Select an event
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {TRIGGERS.map(t => (
              <button
                key={t.id}
                disabled={firing}
                onClick={() => handleFire(t.id)}
                style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', padding:'20px', cursor: firing ? 'not-allowed' : 'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'14px', transition:'all 0.2s', color:'var(--text)', opacity: firing ? 0.45 : 1, fontFamily:'inherit' }}
                onMouseEnter={e => { if (!firing) { e.currentTarget.style.borderColor='var(--violet-border)'; e.currentTarget.style.background='rgba(107,92,231,0.04)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.transform=''; }}
              >
                <div style={{ width:42, height:42, borderRadius:'10px', background:t.ibg, border:`1px solid ${t.ibr}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{ fontSize:'15px', fontWeight:700, marginBottom:'3px' }}>{t.label}</div>
                  <div style={{ fontSize:'12px', color:'var(--text3)' }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: pipeline panel */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px', height:'fit-content' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
            <div style={{ width:28, height:28, background:'var(--bg3)', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 14 14" fill="none" stroke="var(--violet2)" strokeWidth="1.5" width="14" height="14">
                <path d="M1 7h11M8.5 3L13 7l-4.5 4"/>
              </svg>
            </div>
            <div style={{ fontSize:'14px', fontWeight:700 }}>Claim Processing</div>
          </div>

          {step === -1 ? (
            /* Waiting state */
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px', color:'var(--text3)' }}>
              <div style={{ width:52, height:52, background:'var(--bg3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'12px' }}>⚡</div>
              <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text2)', marginBottom:'4px' }}>Waiting for trigger</div>
              <div style={{ fontSize:'12px', textAlign:'center' }}>Select an event on the left to start</div>
            </div>
          ) : (
            <div>
              {/* Pipeline steps */}
              {STEPS.map((label, i) => {
                const s = stepState(i);
                return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', position:'relative' }}>
                    {i < 4 && <div style={{ position:'absolute', left:'11px', top:'26px', bottom:'-8px', width:'1px', background:'rgba(255,255,255,0.06)' }} />}
                    <div style={dotStyle(s)}>{s === 'done' ? '✓' : s === 'fail' ? '✕' : i + 1}</div>
                    <div style={{ paddingBottom: i < 4 ? '14px' : '0' }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color: s === 'live' ? 'var(--violet2)' : s === 'done' ? 'var(--text)' : 'var(--text3)', marginBottom:'2px' }}>{label}</div>
                      <div style={{ fontSize:'12px', color:'var(--text3)' }}>
                        {s === 'done' ? '✓ Complete' : s === 'live' ? 'Processing...' : s === 'fail' ? 'Blocked' : 'Waiting...'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Fraud breakdown (shown after step 3) */}
              {step >= 3 && lastResult?.fraud && (
                <div style={{ marginTop:'16px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px' }}>
                    Fraud analysis detail
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'10px' }}>
                    {lastResult.fraud.layerDetails && Object.entries(lastResult.fraud.layerDetails).map(([key, val]) => (
                      <div key={key} style={{ background:'var(--bg3)', borderRadius:'var(--radius-sm)', padding:'10px 12px' }}>
                        <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>
                          {key === 'gps' ? 'GPS Location' : key === 'activity' ? 'User Activity' : key === 'repeatClaim' ? 'Repeat Claim' : 'Time Window'}
                        </div>
                        <div style={{ fontSize:'13px', fontWeight:700, color: val.passed ? 'var(--teal)' : 'var(--rose)' }}>
                          {val.passed ? '✓ Pass' : '✗ Fail'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:'10px 12px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', fontSize:'13px' }}>
                    Fraud score:{' '}
                    <strong style={{ fontSize:'15px', color: ok ? 'var(--teal)' : 'var(--rose)' }}>
                      {lastResult.fraud.score?.toFixed(2)}
                    </strong>
                    <span style={{ marginLeft:'8px', fontSize:'11px', color:'var(--text3)' }}>
                      {ok ? 'Auto-approved' : 'Flagged for review'}
                    </span>
                  </div>
                </div>
              )}

              {/* Final result */}
              {animDone && lastResult && (
                <div style={{ marginTop:'14px', padding:'14px 16px', borderRadius:'var(--radius-sm)', fontSize:'13px', fontWeight:600, ...(ok ? { background:'var(--teal-bg)', border:'1px solid var(--teal-border)', color:'var(--teal)' } : { background:'var(--gold-bg)', border:'1px solid var(--gold-border)', color:'var(--gold)' }) }}>
                  {ok ? (
                    <div>
                      <div style={{ fontWeight:700, marginBottom:'8px' }}>✅ Claim approved — UPI initiated</div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', fontSize:'12px' }}>
                        <div>
                          <div style={{ opacity:0.6, fontWeight:700, textTransform:'uppercase', fontSize:'10px', marginBottom:'2px' }}>Payout</div>
                          <div style={{ fontSize:'18px', fontWeight:900 }}>{fmt(lastResult.claim?.payoutAmount)}</div>
                        </div>
                        <div>
                          <div style={{ opacity:0.6, fontWeight:700, textTransform:'uppercase', fontSize:'10px', marginBottom:'2px' }}>Txn ID</div>
                          <div style={{ fontWeight:700, fontSize:'11px', wordBreak:'break-all' }}>{lastResult.claim?.txnId}</div>
                        </div>
                      </div>
                      <div style={{ marginTop:'8px', fontSize:'11px', opacity:0.7 }}>✉ Notified: claims@surakshapay.ai</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight:700, marginBottom:'6px' }}>⚠️ Flagged — manual review required</div>
                      <div style={{ fontSize:'12px', marginBottom:'6px' }}>
                        Score: <strong>{lastResult.fraud?.score?.toFixed(2)}</strong> &gt; threshold 0.75
                      </div>
                      {lastResult.fraud?.reasons?.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'8px' }}>
                          {lastResult.fraud.reasons.map(r => (
                            <span key={r} style={{ fontSize:'11px', background:'rgba(224,91,107,0.1)', color:'var(--rose)', padding:'2px 8px', borderRadius:'20px' }}>{r}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize:'11px', opacity:0.7 }}>✉ Alert sent to claims@surakshapay.ai</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
