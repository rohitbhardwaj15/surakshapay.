import React from 'react';
import { useAppSelector, selectPage, selectIsActive, selectClaims } from '../../store/hooks.js';

const PAGE_META = {
  register:  { title: 'Create Account',  sub: 'Get insured in under 60 seconds' },
  overview:  { title: 'Overview',        sub: '' },
  policy:    { title: 'Policy',          sub: 'Manage your coverage and premium' },
  triggers:  { title: 'Triggers',        sub: 'Simulate a parametric event to file an instant claim' },
  claims:    { title: 'Claims',          sub: 'Your complete claims history' },
  fraud:     { title: 'Fraud Detection', sub: 'AI-powered real-time claim validation' },
};

export default function Topbar() {
  const page     = useAppSelector(selectPage);
  const isActive = useAppSelector(selectIsActive);
  const claims   = useAppSelector(selectClaims);
  const meta     = PAGE_META[page] || { title: page, sub: '' };

  return (
    <div style={{ height:'var(--topbar-height)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0, background:'var(--bg)' }}>
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:700, marginBottom:'1px', color:'var(--text)' }}>{meta.title}</h2>
        {meta.sub && <p style={{ fontSize:'12px', color:'var(--text3)' }}>{meta.sub}</p>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', background:'var(--bg2)', border:'1px solid var(--border)', fontSize:'12px', fontWeight:600, color:'var(--text2)' }}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12"><path d="M1 6h8M6.5 3L10 6l-3.5 3"/></svg>
          {claims.length} claim{claims.length !== 1 ? 's' : ''}
        </div>
        <span style={{
          display:'inline-flex', alignItems:'center', gap:'5px', padding:'4px 11px',
          borderRadius:'20px', fontSize:'12px', fontWeight:700,
          background: isActive ? 'var(--teal-bg)' : 'var(--rose-bg)',
          color:      isActive ? 'var(--teal)'    : 'var(--rose)',
          border:     isActive ? '1px solid var(--teal-border)' : '1px solid var(--rose-border)',
        }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', display:'inline-block' }} />
          Policy {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
}
