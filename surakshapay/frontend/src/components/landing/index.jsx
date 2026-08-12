import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks.js';
import { showApp } from '../../store/slices/uiSlice.js';
import { setPage } from '../../store/slices/uiSlice.js';

// ── LandingNav ──────────────────────────────────────────────────
export function LandingNav() {
  const dispatch = useAppDispatch();
  const go = () => { dispatch(showApp()); dispatch(setPage('register')); };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  return (
    <nav style={{ height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', borderBottom:'1px solid var(--border)', background:'rgba(13,15,26,0.95)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'16px', fontWeight:700, color:'var(--text)' }}>
        <div style={{ width:32, height:32, background:'var(--violet)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="19" height="19"><path d="M9 1.5L2 5v5c0 3.9 2.97 7.55 7 8.5C13.03 17.55 16 13.9 16 10V5L9 1.5z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.2"/><path d="M6 9.5l2.2 2.2 4.2-5.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        SurakshaPay
      </div>
      <div style={{ display:'flex', gap:'28px' }}>
        {[['featuresSection','Features'],['howSection','How it works']].map(([id,label]) => (
          <span key={id} onClick={() => scrollTo(id)} style={{ fontSize:'14px', color:'var(--text2)', cursor:'pointer', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--text2)'}>{label}</span>
        ))}
      </div>
      <div style={{ display:'flex', gap:'10px' }}>
        <button onClick={go} style={{ padding:'7px 14px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border2)', background:'transparent', color:'var(--text2)', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--violet)';e.currentTarget.style.color='var(--violet2)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text2)';}}>Dashboard</button>
        <button onClick={go} style={{ padding:'8px 18px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'14px', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit' }}>New Account</button>
      </div>
    </nav>
  );
}

// ── HeroSection ─────────────────────────────────────────────────
export function HeroSection() {
  const dispatch = useAppDispatch();
  const go = () => { dispatch(showApp()); dispatch(setPage('register')); };
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 32px 80px' }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'20px', padding:'6px 16px', fontSize:'12px', color:'var(--text2)', marginBottom:'32px' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--teal)', display:'inline-block' }} />
        AI-Powered Parametric Insurance · India's First
      </div>
      <h1 style={{ fontSize:'clamp(36px,6vw,60px)', fontWeight:800, letterSpacing:'-2px', lineHeight:1.08, color:'var(--text)', marginBottom:'20px', maxWidth:'700px' }}>
        Protect your income<br/><span style={{ color:'var(--violet2)' }}>automatically</span>
      </h1>
      <p style={{ fontSize:'17px', color:'var(--text2)', maxWidth:'500px', lineHeight:1.7, marginBottom:'40px' }}>
        Parametric micro-insurance for delivery partners. Instant payouts when weather or events disrupt your work — zero paperwork, zero waiting.
      </p>
      <div style={{ display:'flex', gap:'12px', marginBottom:'52px', flexWrap:'wrap', justifyContent:'center' }}>
        <button onClick={go} style={{ padding:'13px 28px', borderRadius:'var(--radius-sm)', background:'var(--violet)', color:'#fff', fontSize:'15px', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.background='var(--violet2)';e.currentTarget.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.currentTarget.style.background='var(--violet)';e.currentTarget.style.transform='';}}>Get Protected Free →</button>
        <button onClick={() => document.getElementById('howSection')?.scrollIntoView({behavior:'smooth'})} style={{ padding:'12px 24px', borderRadius:'var(--radius-sm)', background:'var(--bg2)', color:'var(--text)', fontSize:'15px', fontWeight:500, border:'1px solid var(--border2)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>See how it works</button>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'14px', fontSize:'13px', color:'var(--text3)' }}>
        <span>Trusted by partners at</span>
        {['Zepto','Blinkit','Swiggy','Dunzo'].map(p => (
          <span key={p} style={{ padding:'4px 12px', borderRadius:'20px', background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:'12px', fontWeight:600 }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

// ── StatsBar ────────────────────────────────────────────────────
export function StatsBar() {
  const stats = [['< 2s','Claim processing time'],['70%','Income coverage per claim'],['8','Trigger event types'],['0','Documents required']];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
      {stats.map(([v,l],i) => (
        <div key={l} style={{ padding:'24px 32px', textAlign:'center', borderRight:i<3?'1px solid var(--border)':'none' }}>
          <div style={{ fontSize:'32px', fontWeight:800, letterSpacing:'-1px', marginBottom:'4px' }}>{v}</div>
          <div style={{ fontSize:'13px', color:'var(--text2)' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ── FeaturesSection ─────────────────────────────────────────────
const FEATURES = [
  { icon:'⚡', bg:'var(--gold-bg)', border:'var(--gold-border)', title:'Instant Payouts', desc:'Claims processed automatically within seconds. No forms, no agents, no delays — ever.' },
  { icon:'🤖', bg:'var(--violet-bg)', border:'var(--violet-border)', title:'AI Fraud Detection', desc:'Our ML engine validates every claim in real-time, ensuring fair payouts for genuine events only.' },
  { icon:'📄', bg:'var(--teal-bg)', border:'var(--teal-border)', title:'Zero Paperwork', desc:'Parametric triggers mean no documentation needed. If the event happens, you get paid automatically.' },
  { icon:'📊', bg:'var(--blue-bg)', border:'var(--blue-border)', title:'Risk-Based Pricing', desc:'Personalised premiums from your income, location, and AI risk profile. Transparent and fair.' },
  { icon:'🔔', bg:'var(--rose-bg)', border:'var(--rose-border)', title:'Smart Alerts', desc:'AI-powered shift suggestions based on weather forecasts. Protect earnings before disruptions happen.' },
  { icon:'📈', bg:'rgba(79,195,247,0.1)', border:'rgba(79,195,247,0.2)', title:'Admin Analytics', desc:'Loss ratio, fraud heatmap, zone risk, and predictive claim forecasting for platform operators.' },
];

export function FeaturesSection() {
  return (
    <div id="featuresSection" style={{ padding:'80px 60px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--violet2)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'12px' }}>Why SurakshaPay</div>
      <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, letterSpacing:'-1px', marginBottom:'12px' }}>Insurance that works as hard as you do</h2>
      <p style={{ fontSize:'16px', color:'var(--text2)', lineHeight:1.7, maxWidth:'500px', marginBottom:'48px' }}>Automated, transparent, and built for the gig economy.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
        {FEATURES.map((f,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'24px', transition:'all 0.25s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--violet-border)';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='';}}>
            <div style={{ width:44, height:44, borderRadius:'11px', background:f.bg, border:`1px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'16px' }}>{f.icon}</div>
            <h3 style={{ fontSize:'15px', fontWeight:700, marginBottom:'7px' }}>{f.title}</h3>
            <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HowItWorksSection ───────────────────────────────────────────
const HOW = [
  { num:'01', icon:'⏱', title:'Register in 60 seconds', sub:'Enter your name, city, platform, and weekly income. No documents required.' },
  { num:'02', icon:'🔒', title:'Activate your policy',   sub:'Pay a small weekly premium calculated from your AI-assessed risk profile.' },
  { num:'03', icon:'📡', title:'Triggers detected automatically', sub:'Rain, heatwave, AQI spike, flood, or curfew — our system monitors it all, 24/7.' },
  { num:'04', icon:'⚡', title:'Payout in your account', sub:'70% of your weekly income, instantly transferred. No questions asked.' },
];

export function HowItWorksSection() {
  return (
    <div id="howSection" style={{ padding:'0 60px 80px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--violet2)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'12px' }}>How it works</div>
      <h2 style={{ fontSize:'clamp(22px,4vw,34px)', fontWeight:800, letterSpacing:'-1px', marginBottom:'32px' }}>From sign-up to payout in minutes</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxWidth:'760px' }}>
        {HOW.map(s => (
          <div key={s.num} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 24px', transition:'border-color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:36, height:36, borderRadius:'9px', background:'var(--violet-bg)', border:'1px solid var(--violet-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, color:'var(--violet2)' }}>{s.num}</div>
              <div style={{ width:36, height:36, borderRadius:'9px', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>{s.icon}</div>
              <div><div style={{ fontSize:'15px', fontWeight:700, marginBottom:'3px' }}>{s.title}</div><div style={{ fontSize:'13px', color:'var(--text2)' }}>{s.sub}</div></div>
            </div>
            <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--teal-bg)', border:'1px solid var(--teal-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--teal)', fontSize:'12px', flexShrink:0 }}>✓</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TestimonialsSection ─────────────────────────────────────────
const TESTS = [
  { ava:'RK', ac:'var(--teal-bg)', atc:'var(--teal)', text:'"I got paid within seconds after the heavy rain last Tuesday. No calls, no forms — just money in my account."', name:'Ravi Kumar', role:'Zepto Partner · Mumbai' },
  { ava:'PS', ac:'var(--violet-bg)', atc:'var(--violet2)', text:'"During the AQI spike last month, I couldn\'t work for 3 days. SurakshaPay covered 70% of my income automatically."', name:'Priya Sharma', role:'Blinkit Partner · Delhi' },
  { ava:'AN', ac:'rgba(74,158,255,0.15)', atc:'var(--blue)', text:'"The registration took less than a minute. My premium is very affordable and the coverage is real."', name:'Arjun Nair', role:'Swiggy Partner · Bangalore' },
];

export function TestimonialsSection() {
  return (
    <div style={{ padding:'0 60px 80px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
        {TESTS.map((t,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'22px', transition:'all 0.25s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='';}}>
            <div style={{ color:'var(--gold)', fontSize:'14px', letterSpacing:'1px', marginBottom:'12px' }}>★★★★★</div>
            <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.7, marginBottom:'16px', fontStyle:'italic' }}>{t.text}</p>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:t.ac, color:t.atc, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700 }}>{t.ava}</div>
              <div><div style={{ fontSize:'13px', fontWeight:700 }}>{t.name}</div><div style={{ fontSize:'11px', color:'var(--text3)' }}>{t.role}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAQSection ──────────────────────────────────────────────────
const FAQS = [
  { q:'How does parametric insurance work?', a:'Instead of filing a claim after a loss, parametric insurance pays automatically when a predefined event (like heavy rain or heatwave) is detected. No paperwork, no assessment — just an instant payout.' },
  { q:'How is my premium calculated?', a:'Premium = Weekly Income × 5% × (1 + Risk Score). Your risk score is AI-assessed based on your city, platform, and delivery history. It updates weekly.' },
  { q:'When exactly do I get paid?', a:'Once a qualifying trigger is detected, our system validates and processes the claim in under 2 seconds. The payout (70% of weekly income) is credited to your UPI immediately.' },
  { q:'What if my claim is flagged for review?', a:'Claims scoring above 0.75 on our fraud engine go to manual review. Our team contacts you within 24 hours. You can see the specific reasons in your Fraud Detection page.' },
  { q:'Can I deactivate my policy anytime?', a:'Yes. You can activate or deactivate your policy at any time from the Policy page. No lock-in, no penalties.' },
  { q:'Which cities and platforms are supported?', a:'Platforms: Zepto, Blinkit, Swiggy, Zomato, Dunzo, BigBasket. Cities: Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad and expanding.' },
];

export function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ padding:'0 60px 80px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
      <div style={{ textAlign:'center', marginBottom:'32px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'var(--violet2)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'12px' }}>FAQ</div>
        <h2 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:800, letterSpacing:'-1px' }}>Frequently asked questions</h2>
      </div>
      <div style={{ maxWidth:'760px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'4px' }}>
        {FAQS.map((f,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:`1px solid ${open===i?'var(--border2)':'var(--border)'}`, borderRadius:'var(--radius-sm)', overflow:'hidden', transition:'border-color 0.2s' }}>
            <div onClick={() => setOpen(open===i?null:i)} style={{ padding:'16px 20px', fontSize:'14px', fontWeight:600, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', userSelect:'none' }}>
              {f.q}
              <span style={{ fontSize:'14px', color:open===i?'var(--violet2)':'var(--text3)', transform:open===i?'rotate(180deg)':'none', transition:'transform 0.2s, color 0.2s', display:'inline-block' }}>⌄</span>
            </div>
            {open===i && <div style={{ padding:'0 20px 16px', fontSize:'13px', color:'var(--text2)', lineHeight:1.7 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CTASection ──────────────────────────────────────────────────
export function CTASection() {
  const dispatch = useAppDispatch();
  const go = () => { dispatch(showApp()); dispatch(setPage('register')); };
  return (
    <div style={{ padding:'0 32px 80px', display:'flex', justifyContent:'center' }}>
      <div style={{ background:'linear-gradient(135deg,#5A4FD0,#7B5CE7,#9B6CF7)', borderRadius:'20px', padding:'60px 48px', textAlign:'center', maxWidth:'780px', width:'100%' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'16px' }}>START TODAY — FREE</div>
        <h2 style={{ fontSize:'36px', fontWeight:800, letterSpacing:'-1px', marginBottom:'12px', lineHeight:1.1 }}>Ready to protect your income?</h2>
        <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.7)', marginBottom:'28px', lineHeight:1.6 }}>Join thousands of delivery partners who never miss a payout.<br/>Takes less than 60 seconds to get covered.</p>
        <button onClick={go} style={{ padding:'13px 28px', borderRadius:'var(--radius-sm)', background:'#fff', color:'var(--violet)', fontSize:'15px', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>Get Protected Now →</button>
      </div>
    </div>
  );
}

// ── LandingFooter ───────────────────────────────────────────────
export function LandingFooter() {
  return (
    <div style={{ background:'var(--bg)', borderTop:'1px solid var(--border)', padding:'32px 60px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
      <div>
        <div style={{ fontSize:'15px', fontWeight:700 }}>SurakshaPay</div>
        <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'3px' }}>© 2026 AI-Powered Parametric Insurance</div>
      </div>
      <div style={{ display:'flex', gap:'24px' }}>
        {['Privacy','Terms','Support','About'].map(l => (
          <span key={l} style={{ fontSize:'13px', color:'var(--text3)', cursor:'pointer', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='var(--teal)'} onMouseLeave={e=>e.target.style.color='var(--text3)'}>{l}</span>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'12px', color:'var(--teal)', fontWeight:600, background:'var(--teal-bg)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius-sm)', padding:'7px 12px' }}>
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><rect x="1" y="3" width="12" height="8" rx="1.5"/><path d="M1 4l6 4.5L13 4"/></svg>
        claims@surakshapay.ai
      </div>
    </div>
  );
}
