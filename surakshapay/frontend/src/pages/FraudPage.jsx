import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector, selectClaims, selectClaimsLoading } from '../store/hooks.js';
import { fetchClaims } from '../store/slices/claimsSlice.js';
import { setPage } from '../store/slices/uiSlice.js';
import { fmtDate, TRIGGER_ICONS, getFraudColor } from '../utils/helpers.js';
import { Pill } from '../components/ui/index.jsx';

const HOW_AI = [
  { icon:'🔍', bg:'var(--violet-bg)', title:'Multi-factor Scoring',   desc:'Evaluates claim frequency, location data, weather API cross-validation, and historical patterns.' },
  { icon:'⚠️', bg:'var(--gold-bg)',   title:'Threshold Detection',    desc:'Claims above 0.75 fraud score are flagged for manual review. Below 0.75 are auto-approved instantly.' },
  { icon:'✅', bg:'var(--teal-bg)',   title:'Instant Decisions',       desc:'The entire fraud check runs in under 2 seconds, enabling real-time payout processing.' },
  { icon:'🔒', bg:'rgba(255,255,255,0.05)', title:'Immutable Audit Trail', desc:'Every decision is logged with timestamp, score, and reasoning for full transparency.' },
];

function FraudGauge({ score }) {
  const circumference = 226.2;
  const offset        = circumference * (1 - Math.min(1, score));
  const color         = getFraudColor(score);
  const label         = score > 0.65 ? 'High Risk' : score > 0.4 ? 'Moderate' : 'Low Risk';
  const desc          = score > 0.65
    ? 'Multiple flags detected. Claims going to manual review.'
    : score > 0.4
    ? 'Some checks flagged. Maintain a clean record for faster approvals.'
    : 'Claim history looks clean. Fast-track approvals enabled.';

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'22px', marginBottom:'16px' }}>
      <div style={{ position:'relative', width:90, height:90, flexShrink:0 }}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
          <circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
          <div style={{ fontSize:'20px', fontWeight:800, color }}>{score.toFixed(2)}</div>
          <div style={{ fontSize:'10px', color:'var(--text3)' }}>avg score</div>
        </div>
      </div>
      <div>
        <h4 style={{ fontSize:'15px', fontWeight:700, color, marginBottom:'5px' }}>{label}</h4>
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.55, marginBottom:'10px' }}>{desc}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
          {[['GPS validation','teal'],['Activity check','violet'],['Repeat detection','gold'],['Time window','blue']].map(([l,v]) => (
            <Pill key={l} variant={v} dot={false} style={{ fontSize:'11px' }}>{l}</Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FraudPage() {
  const dispatch = useAppDispatch();
  const claims   = useAppSelector(selectClaims);
  const loading  = useAppSelector(selectClaimsLoading);

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  const avgScore = claims.length
    ? claims.reduce((s, c) => s + (c.fraudScore || 0), 0) / claims.length
    : 0;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

      {/* Left: Latest claim analysis */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px' }}>
        <div style={{ fontSize:'14px', fontWeight:700, marginBottom:'4px' }}>Latest Claim Analysis</div>
        <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>Most recent fraud check result</div>

        {loading && claims.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'13px' }}>Loading...</div>
        ) : claims.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 16px', color:'var(--text3)' }}>
            <div style={{ width:48, height:48, background:'var(--bg3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'12px' }}>🛡️</div>
            <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text2)', marginBottom:'4px' }}>No claims yet</div>
            <div style={{ fontSize:'12px', marginBottom:'14px', textAlign:'center' }}>Trigger an event to see fraud analysis</div>
            <button
              onClick={() => dispatch(setPage('triggers'))}
              style={{ padding:'9px 20px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'13px', fontWeight:600, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontFamily:'inherit' }}
            >
              ⚡ Simulate Trigger
            </button>
          </div>
        ) : (
          <div>
            <FraudGauge score={avgScore} />

            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'4px' }}>
              {claims.map(c => (
                <div
                  key={c._id || c.id || c.claimId}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', fontSize:'13px' }}
                >
                  <div>
                    <div style={{ fontWeight:600, marginBottom:'2px' }}>
                      {TRIGGER_ICONS[c.triggerType] || '?'} {c.triggerType} — #{c.claimId || c.id}
                    </div>
                    <div style={{ fontSize:'11px', color:'var(--text3)' }}>
                      {fmtDate(c.createdAt)}
                      {c.fraudReasons?.length > 0 && ' · ' + c.fraudReasons.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'16px', fontWeight:800, color: getFraudColor(c.fraudScore || 0) }}>
                      {(c.fraudScore || 0).toFixed(2)}
                    </span>
                    <Pill variant={c.status === 'approved' ? 'teal' : 'gold'}>
                      {c.status === 'approved' ? 'Approved' : 'Review'}
                    </Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: How AI works */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px' }}>
        <div style={{ fontSize:'14px', fontWeight:700, marginBottom:'4px' }}>How Our AI Works</div>
        <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>Multi-layer fraud detection engine</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {HOW_AI.map(item => (
            <div key={item.title} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
              <div style={{ width:32, height:32, borderRadius:'8px', background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:700, marginBottom:'3px' }}>{item.title}</div>
                <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Layer check summary if claims exist */}
        {claims.length > 0 && (
          <div style={{ marginTop:'20px', padding:'14px 16px', background:'var(--bg3)', borderRadius:'var(--radius-sm)' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px' }}>
              Layer check results (latest claim)
            </div>
            {claims[0]?.fraudDetails && Object.entries(claims[0].fraudDetails).map(([key, val]) => (
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px' }}>
                <span style={{ color:'var(--text2)' }}>
                  {key === 'gps' ? '📍 GPS Location' : key === 'activity' ? '👤 User Activity' : key === 'repeatClaim' ? '🔁 Repeat Claim' : '⏰ Time Window'}
                </span>
                <span style={{ fontWeight:700, color: val?.passed ? 'var(--teal)' : 'var(--rose)' }}>
                  {val?.passed ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            ))}
            <div style={{ marginTop:'8px', fontSize:'12px', color:'var(--text3)' }}>
              Overall fraud score:{' '}
              <strong style={{ color: getFraudColor(claims[0]?.fraudScore || 0) }}>
                {(claims[0]?.fraudScore || 0).toFixed(2)}
              </strong>
              {' '}(threshold: 0.75)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
