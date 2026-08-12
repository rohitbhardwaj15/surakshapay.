import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector, selectClaims, selectClaimsLoading } from '../store/hooks.js';
import { fetchClaims } from '../store/slices/claimsSlice.js';
import { setPage } from '../store/slices/uiSlice.js';
import { fmt, fmtDate, TRIGGER_ICONS, TRIGGER_BG } from '../utils/helpers.js';
import { Pill } from '../components/ui/index.jsx';

export default function ClaimsPage() {
  const dispatch = useAppDispatch();
  const claims   = useAppSelector(selectClaims);
  const loading  = useAppSelector(selectClaimsLoading);

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  if (loading && claims.length === 0) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px', color:'var(--text3)', fontSize:'14px' }}>
        Loading claims...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'22px' }}>
        <div />
        <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--teal)', fontWeight:700, background:'var(--teal-bg)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius-sm)', padding:'7px 12px' }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
            <rect x="1" y="3" width="12" height="8" rx="1.5"/><path d="M1 4l6 4.5L13 4"/>
          </svg>
          claims@surakshapay.ai
        </div>
      </div>

      {/* Empty state */}
      {claims.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'72px 20px', color:'var(--text3)' }}>
          <div style={{ width:52, height:52, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'14px' }}>📋</div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text2)', marginBottom:'6px' }}>No claims yet</div>
          <div style={{ fontSize:'13px', marginBottom:'16px' }}>
            Activate your policy and trigger an event to file a claim.
          </div>
          <button
            onClick={() => dispatch(setPage('triggers'))}
            style={{ padding:'9px 20px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'13px', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit' }}
          >
            Go to Triggers
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {claims.map(c => {
            const ok = c.status === 'approved';
            return (
              <div
                key={c._id || c.id || c.claimId}
                style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 22px', display:'grid', gridTemplateColumns:'40px 1fr auto auto auto', gap:'14px', alignItems:'center', transition:'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Trigger icon */}
                <div style={{ width:40, height:40, borderRadius:'10px', background: TRIGGER_BG[c.triggerType] || 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                  {TRIGGER_ICONS[c.triggerType] || '?'}
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontSize:'14px', fontWeight:700, marginBottom:'3px' }}>
                    {c.triggerType} claim
                  </div>
                  <div style={{ fontSize:'12px', color:'var(--text3)' }}>
                    {fmtDate(c.createdAt)} · #{c.claimId || c.id} · Fraud: {(c.fraudScore || 0).toFixed(2)}
                    {c.fraudReasons?.length > 0 && (
                      <span>
                        {' · '}
                        {c.fraudReasons.slice(0, 2).map(r => (
                          <span
                            key={r}
                            style={{ display:'inline-flex', alignItems:'center', marginRight:'4px', fontSize:'11px', background:'var(--rose-bg)', color:'var(--rose)', padding:'1px 7px', borderRadius:'20px', border:'1px solid var(--rose-border)' }}
                          >
                            {r}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ fontSize:'16px', fontWeight:800, color: ok ? 'var(--teal)' : 'var(--gold)' }}>
                  {ok ? fmt(c.payoutAmount) : 'Pending'}
                </div>

                {/* Status pill */}
                <Pill variant={ok ? 'teal' : 'gold'}>
                  {ok ? 'Approved' : 'Under Review'}
                </Pill>

                {/* Email badge */}
                <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', padding:'3px 9px', borderRadius:'20px', ...(ok ? { background:'var(--teal-bg)', color:'var(--teal)', border:'1px solid var(--teal-border)' } : { background:'var(--gold-bg)', color:'var(--gold)', border:'1px solid var(--gold-border)' }) }}>
                  ✉ {ok ? 'Notified' : 'Alerted'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
