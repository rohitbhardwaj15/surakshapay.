import React from 'react';
import { useAppDispatch, useAppSelector, selectPage } from '../../store/hooks.js';
import { setPage, showLanding } from '../../store/slices/uiSlice.js';
import { logout } from '../../store/slices/authSlice.js';
import { resetPolicy } from '../../store/slices/policySlice.js';
import { resetClaims } from '../../store/slices/claimsSlice.js';
import api from '../../utils/api.js';

const NAV = [
  { id: 'overview', label: 'Overview',
    icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg> },
  { id: 'policy',   label: 'Policy',
    icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><circle cx="7" cy="7" r="5.5"/><path d="M7 4.5v3l1.5 1.5"/></svg> },
  { id: 'triggers', label: 'Triggers',
    icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M7 1l1.5 4h4l-3 2.5 1 4L7 9l-3.5 2.5 1-4L1.5 5h4z"/></svg> },
  { id: 'claims',   label: 'Claims',
    icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><rect x="2" y="1" width="10" height="12" rx="1.5"/><path d="M4.5 5h5M4.5 8h3"/></svg> },
  { id: 'fraud',    label: 'Fraud Detection',
    icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M7 1.5L2 4v4c0 3 2.2 5.5 5 6.5 2.8-1 5-3.5 5-6.5V4L7 1.5z"/></svg> },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const page     = useAppSelector(selectPage);

  const handleLogout = () => {
    api.removeToken();
    dispatch(logout());
    dispatch(resetPolicy());
    dispatch(resetClaims());
    dispatch(showLanding());
  };

  return (
    <div style={{ width:'var(--sidebar-width)', background:'var(--bg)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:30, height:30, background:'var(--violet)', borderRadius:'7px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg viewBox="0 0 18 18" fill="none" width="17" height="17">
              <path d="M9 1.5L2 5v5c0 3.9 2.97 7.55 7 8.5C13.03 17.55 16 13.9 16 10V5L9 1.5z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.2"/>
              <path d="M6 9.5l2.2 2.2 4.2-5.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>SurakshaPay</div>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'1px' }}>Insurtech Platform</div>
          </div>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--teal)', boxShadow:'0 0 6px rgba(0,200,150,0.5)', flexShrink:0 }} />
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding:'12px 10px', flex:1 }}>
        <div style={{ fontSize:'10px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', padding:'4px 8px', marginBottom:'6px' }}>
          Main menu
        </div>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => dispatch(setPage(item.id))}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight: active ? 600 : 500, color: active ? 'var(--violet2)' : 'var(--text2)', background: active ? 'var(--violet-bg)' : 'transparent', border:'none', width:'100%', textAlign:'left', transition:'all 0.15s', marginBottom:'2px', position:'relative', fontFamily:'inherit' }}
              onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}
            >
              {item.icon}{item.label}
              {active && <span style={{ position:'absolute', right:'10px', color:'var(--violet2)', fontSize:'16px' }}>›</span>}
            </button>
          );
        })}
      </nav>

      {/* Platform stats + sign out */}
      <div style={{ padding:'12px 14px 16px', borderTop:'1px solid var(--border)' }}>
        <div style={{ fontSize:'10px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'10px' }}>Platform</div>
        {[['Avg. payout time','< 2s'],['Fraud detection','99.2%'],['Uptime SLA','99.9%']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'6px' }}>
            <span style={{ color:'var(--text3)' }}>{k}</span>
            <span style={{ fontWeight:700, color:'var(--text2)' }}>{v}</span>
          </div>
        ))}
        <button onClick={handleLogout}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', color:'var(--text3)', border:'none', background:'transparent', width:'100%', marginTop:'8px', transition:'color 0.2s', fontFamily:'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color='var(--rose)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M5 7h7M9.5 4.5L12 7l-2.5 2.5"/><path d="M8 2H3a1 1 0 00-1 1v8a1 1 0 001 1h5"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
