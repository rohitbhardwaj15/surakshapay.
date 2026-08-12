import React from 'react';
import { useAppDispatch, useAppSelector, selectUser, selectPolicy, selectClaims, selectIsActive, selectTotalPaidOut, selectApprovedCount } from '../store/hooks.js';
import { setPage } from '../store/slices/uiSlice.js';
import { fmt, TRIGGER_ICONS, TRIGGER_BG, getRiskColor, getRiskLabel } from '../utils/helpers.js';
import { Pill } from '../components/ui/index.jsx';

export default function OverviewPage() {
  const dispatch      = useAppDispatch();
  const user          = useAppSelector(selectUser);
  const policy        = useAppSelector(selectPolicy);
  const claims        = useAppSelector(selectClaims);
  const isActive      = useAppSelector(selectIsActive);
  const totalPaid     = useAppSelector(selectTotalPaidOut);
  const approvedCount = useAppSelector(selectApprovedCount);

  if (!user) return null;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:800, letterSpacing:'-0.3px', marginBottom:'4px' }}>
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize:'13px', color:'var(--text3)' }}>Here's a summary of your coverage and recent activity.</p>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'20px' }}>
        {[
          { label:'Weekly Income',    value:fmt(user.weeklyIncome),   sub:user.platform,         color:'var(--violet2)', icon:'₹',  iconBg:'var(--violet-bg)' },
          { label:'Coverage Amount',  value:fmt(user.coverageAmount), sub:'70% of income',       color:'var(--teal)',    icon:'📈', iconBg:'var(--teal-bg)' },
          { label:'Weekly Premium',   value:fmt(user.weeklyPremium),  sub:'per week',            color:'var(--text)',    icon:'🔒', iconBg:'var(--bg3)' },
          { label:'Risk Score',       value:user.riskScore?.toFixed(2), sub:getRiskLabel(user.riskScore), color:getRiskColor(user.riskScore), icon:'△', iconBg:'var(--bg3)' },
        ].map((m, i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'18px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:'12px', color:'var(--text2)', marginBottom:'8px', fontWeight:500 }}>{m.label}</div>
              <div style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-0.5px', marginBottom:'4px', color:m.color }}>{m.value}</div>
              <div style={{ fontSize:'12px', color:'var(--text3)' }}>{m.sub}</div>
            </div>
            <div style={{ width:36, height:36, borderRadius:'9px', background:m.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>{m.icon}</div>
          </div>
        ))}
      </div>

      {/* Middle panels */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
        {/* Policy status */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px' }}>
          <div style={{ fontSize:'14px', fontWeight:700, marginBottom:'4px' }}>Policy Status</div>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>Manage your active coverage</div>

          {isActive ? (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', background:'var(--teal-bg)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius-sm)', marginBottom:'14px' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--teal)', boxShadow:'0 0 6px rgba(0,200,150,0.5)' }} />
              <div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'var(--teal)' }}>Active</div>
                <div style={{ fontSize:'12px', color:'var(--text3)' }}>Coverage running. All 8 triggers monitored.</div>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', background:'var(--bg3)', borderRadius:'var(--radius-sm)', marginBottom:'14px' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--rose-bg)', border:'1px solid var(--rose-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--rose)', fontSize:'12px', flexShrink:0 }}>✕</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:700 }}>Not Active</div>
                <div style={{ fontSize:'12px', color:'var(--text3)' }}>Activate to start coverage</div>
              </div>
            </div>
          )}

          {[
            ['Premium',  fmt(user.weeklyPremium) + ' / week'],
            ['Coverage', fmt(user.coverageAmount)],
            ['Total Paid', fmt(totalPaid)],
            ['Approved', `${approvedCount} / ${claims.length} claims`],
          ].map(([k, v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
              <span style={{ color:'var(--text2)' }}>{k}</span>
              <span style={{ fontWeight:700, color: k === 'Total Paid' ? 'var(--teal)' : 'var(--text)' }}>{v}</span>
            </div>
          ))}

          <button
            onClick={() => dispatch(setPage('policy'))}
            style={{ width:'100%', marginTop:'14px', padding:'11px', borderRadius:'var(--radius-sm)', background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontFamily:'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            Manage Policy →
          </button>
        </div>

        {/* Recent claims */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 22px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
            <div style={{ fontSize:'14px', fontWeight:700 }}>Recent Claims</div>
            <span onClick={() => dispatch(setPage('claims'))} style={{ fontSize:'12px', color:'var(--violet2)', cursor:'pointer', fontWeight:600 }}>View all →</span>
          </div>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>Latest claim activity</div>

          {claims.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 16px', color:'var(--text3)' }}>
              <div style={{ width:52, height:52, background:'var(--bg3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'12px' }}>🔒</div>
              <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'14px' }}>Activate your policy and trigger an event</p>
              <button
                onClick={() => dispatch(setPage('triggers'))}
                style={{ padding:'9px 20px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'13px', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit' }}
              >
                ⚡ Simulate Trigger
              </button>
            </div>
          ) : (
            claims.slice(0, 4).map(c => (
              <div key={c.id || c._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'13px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:32, height:32, borderRadius:'8px', background: TRIGGER_BG[c.triggerType] || 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>
                    {TRIGGER_ICONS[c.triggerType] || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight:600 }}>{c.triggerType}</div>
                    <div style={{ fontSize:'11px', color:'var(--text3)' }}>{c.claimId || c.id}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ fontSize:'14px', fontWeight:800, color: c.status === 'approved' ? 'var(--teal)' : 'var(--gold)' }}>
                    {c.status === 'approved' ? fmt(c.payoutAmount) : 'Pending'}
                  </span>
                  <Pill variant={c.status === 'approved' ? 'teal' : 'gold'}>
                    {c.status === 'approved' ? 'Approved' : 'Review'}
                  </Pill>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email notification bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:34, height:34, background:'var(--bg3)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>🔔</div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:700, marginBottom:'2px' }}>Email notifications active</div>
            <div style={{ fontSize:'12px', color:'var(--text3)' }}>Every approved payout and flagged claim is sent to the claims channel</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--teal)', fontWeight:700 }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><rect x="1" y="3" width="12" height="8" rx="1.5"/><path d="M1 4l6 4.5L13 4"/></svg>
          claims@surakshapay.ai
        </div>
      </div>
    </div>
  );
}
