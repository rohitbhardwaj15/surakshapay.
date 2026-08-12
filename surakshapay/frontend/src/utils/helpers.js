export const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

export const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

export const getRiskColor = (score) => {
  if (score < 0.35) return 'var(--teal)';
  if (score < 0.65) return 'var(--gold)';
  return 'var(--rose)';
};

export const getRiskLabel = (score) => {
  if (score < 0.35) return 'Low Risk';
  if (score < 0.65) return 'Moderate Risk';
  return 'High Risk';
};

export const getFraudColor = (score) => {
  if (score > 0.75) return 'var(--rose)';
  if (score > 0.4)  return 'var(--gold)';
  return 'var(--teal)';
};

export const TRIGGER_ICONS = {
  Rain: '🌧️', AQI: '🌫️', Heatwave: '🌡️', Curfew: '🚫',
  Flood: '🌊', Cyclone: '🌀', 'Dense Fog': '🌫', Bandh: '⛔',
};

export const TRIGGER_BG = {
  Rain: 'rgba(74,158,255,0.12)', AQI: 'rgba(107,92,231,0.12)',
  Heatwave: 'rgba(245,166,35,0.12)', Curfew: 'rgba(224,91,107,0.12)',
  Flood: 'rgba(0,200,150,0.12)', Cyclone: 'rgba(74,158,255,0.08)',
  'Dense Fog': 'rgba(255,255,255,0.05)', Bandh: 'rgba(224,91,107,0.12)',
};

export const CLAIMS_EMAIL = 'claims@surakshapay.ai';

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));
