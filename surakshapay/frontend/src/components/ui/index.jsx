// ── Loader ──────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';

export function Loader() {
  return (
    <div style={{ position:'fixed', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', zIndex:9999 }}>
      <div style={{ fontSize:'24px', fontWeight:800, letterSpacing:'-0.5px', color:'var(--text)' }}>SurakshaPay</div>
      <div className="spin" style={{ width:40, height:40, border:'3px solid rgba(107,92,231,0.15)', borderTopColor:'var(--violet)', borderRadius:'50%' }} />
      <div style={{ fontSize:'13px', color:'var(--text3)' }}>Loading insurance engine...</div>
    </div>
  );
}

export default Loader;

// ── Button ──────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: { background:'var(--violet)', color:'#fff', border:'none' },
  teal:    { background:'var(--teal)',   color:'#0D0F1A', border:'none' },
  ghost:   { background:'transparent',  color:'var(--text)', border:'1px solid var(--border2)' },
  danger:  { background:'var(--rose-bg)', color:'var(--rose)', border:'1px solid var(--rose-border)' },
  outline: { background:'transparent',  color:'var(--text2)', border:'1px solid var(--border)' },
};

export function Button({ children, variant='primary', size='md', fullWidth=false, disabled=false, onClick, style={}, type='button' }) {
  const v   = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const pad = size === 'sm' ? '8px 18px' : size === 'xs' ? '5px 12px' : '12px 22px';
  const fs  = size === 'sm' ? '13px' : size === 'xs' ? '12px' : '14px';
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:pad, fontSize:fs, fontWeight:600, borderRadius:'var(--radius-sm)', cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, transition:'all 0.18s', width:fullWidth?'100%':undefined, fontFamily:'inherit', letterSpacing:'-0.1px', ...v, ...style }}>
      {children}
    </button>
  );
}

// ── Alert ───────────────────────────────────────────────────────
const ALERT_STYLES = {
  ok:   { background:'var(--teal-bg)',   color:'var(--teal)',   border:'1px solid var(--teal-border)'   },
  err:  { background:'var(--rose-bg)',   color:'var(--rose)',   border:'1px solid var(--rose-border)'   },
  warn: { background:'var(--gold-bg)',   color:'var(--gold)',   border:'1px solid var(--gold-border)'   },
  info: { background:'var(--violet-bg)', color:'var(--violet2)', border:'1px solid var(--violet-border)' },
};
const ALERT_ICONS = { ok:'✅', err:'❌', warn:'⚠️', info:'ℹ️' };

export function Alert({ message, type='ok', duration=4000, onClose }) {
  const [visible, setVisible] = useState(!!message);
  useEffect(() => {
    setVisible(!!message);
    if (message && duration) {
      const t = setTimeout(() => { setVisible(false); onClose?.(); }, duration);
      return () => clearTimeout(t);
    }
  }, [message, duration]);
  if (!visible || !message) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 15px', borderRadius:'var(--radius-sm)', fontSize:'13px', fontWeight:600, marginBottom:'14px', ...ALERT_STYLES[type] }}>
      {ALERT_ICONS[type]} {message}
    </div>
  );
}

// ── Pill ────────────────────────────────────────────────────────
const PILL_VARIANTS = {
  teal:   { background:'var(--teal-bg)',   color:'var(--teal)',   border:'1px solid var(--teal-border)'   },
  gold:   { background:'var(--gold-bg)',   color:'var(--gold)',   border:'1px solid var(--gold-border)'   },
  rose:   { background:'var(--rose-bg)',   color:'var(--rose)',   border:'1px solid var(--rose-border)'   },
  violet: { background:'var(--violet-bg)', color:'var(--violet2)', border:'1px solid var(--violet-border)' },
  blue:   { background:'var(--blue-bg)',   color:'var(--blue)',   border:'1px solid var(--blue-border)'   },
};

export function Pill({ children, variant='teal', dot=true, style={} }) {
  const v = PILL_VARIANTS[variant] || PILL_VARIANTS.teal;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700, ...v, ...style }}>
      {dot && <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor' }} />}
      {children}
    </span>
  );
}

// ── FormField / Input / Select ──────────────────────────────────
export function FormField({ label, children, hint, style={} }) {
  return (
    <div style={{ marginBottom:'16px', ...style }}>
      {label && <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'var(--text3)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.7px' }}>{label}</label>}
      {children}
      {hint && <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'5px' }}>{hint}</div>}
    </div>
  );
}

const inputBase = { width:'100%', padding:'11px 14px', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', fontSize:'14px', color:'var(--text)', background:'var(--bg3)', outline:'none', transition:'all 0.15s', fontFamily:'inherit', appearance:'none' };

export function Input({ prefix, style={}, ...props }) {
  return (
    <div style={{ position:'relative' }}>
      {prefix && <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:'14px' }}>{prefix}</span>}
      <input {...props} style={{ ...inputBase, paddingLeft:prefix?'26px':'14px', ...style }}
        onFocus={e => { e.target.style.borderColor='var(--violet-border)'; e.target.style.background='rgba(107,92,231,0.04)'; }}
        onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg3)'; }}
      />
    </div>
  );
}

export function Select({ children, style={}, ...props }) {
  return (
    <select {...props} style={{ ...inputBase, ...style }}
      onFocus={e => e.target.style.borderColor='var(--violet-border)'}
      onBlur={e  => e.target.style.borderColor='var(--border)'}
    >
      {children}
    </select>
  );
}
