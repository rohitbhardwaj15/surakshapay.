const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken()        { return localStorage.getItem('sp_token'); }
function setToken(token)   { localStorage.setItem('sp_token', token); }
function removeToken()     { localStorage.removeItem('sp_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res  = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err    = new Error(data.error || `Request failed: ${res.status}`);
    err.status   = res.status;
    err.data     = data;
    throw err;
  }
  return data;
}

const api = {
  // Auth
  register:  (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:     (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:    ()     => request('/auth/logout',   { method: 'POST' }),

  // User
  getMe:          () => request('/users/me'),
  getDashboard:   () => request('/users/me/dashboard'),

  // Policy
  getPolicy:       () => request('/policy'),
  activatePolicy:  () => request('/policy/activate',   { method: 'POST' }),
  deactivatePolicy:() => request('/policy/deactivate', { method: 'POST' }),

  // Triggers
  getTriggerTypes: () => request('/triggers/types'),
  fireTrigger:     (triggerType) => request('/triggers/fire', { method: 'POST', body: JSON.stringify({ triggerType }) }),

  // Claims
  getClaims:       () => request('/claims'),
  getClaimById:    (id) => request(`/claims/${id}`),

  // Admin
  getAdminStats:   () => request('/admin/stats'),
  getFraudAlerts:  () => request('/admin/fraud-alerts'),
  getZoneRisk:     () => request('/admin/zone-risk'),

  // Health
  health: () => request('/health'),

  // Token helpers
  setToken, getToken, removeToken,
};

export default api;
