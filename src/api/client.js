const API_BASE = import.meta.env.VITE_API_BASE;

function notifyAuthChange() {
  window.dispatchEvent(new Event("veracity-auth-changed"));
}

export function saveToken(token, role) {
  localStorage.setItem("veracity_token", token);
  if (role) localStorage.setItem("veracity_role", role);
  notifyAuthChange(); 
}
export function getToken() { return localStorage.getItem("veracity_token"); }

export function getRole()  { return localStorage.getItem("veracity_role"); }

export function clearToken() {
  localStorage.removeItem("veracity_token");
  localStorage.removeItem("veracity_role");
  notifyAuthChange(); 
}

export async function apiFetch(path, { auth=false, method="GET", body, headers } = {}) {
  const init = { method, headers: { "Content-Type": "application/json", ...(headers||{}) } };
  if (auth) { const t = getToken(); if (t) init.headers.Authorization = `Bearer ${t}`; }
  if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, init);
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = (data && (data.detail||data.message)) || `Erro ${res.status}`;
    const err = new Error(msg); err.status=res.status; err.data=data; throw err;
  }
  return data;
}

export const apiLogin  = async (email, password) => {
  const data = await apiFetch("/auth/login", { method:"POST", body:{ email, password } });
  saveToken(data.access_token, data.role);
  return data;
};

export const apiLogout = () => apiFetch("/auth/logout", { auth:true, method:"POST" }).catch(()=>{}).finally(clearToken);

export const apiRegister = (name, email, password, confirm_password, accepted_terms) =>
  apiFetch("/auth/register", { method:"POST", body:{ name, email, password, confirm_password, accepted_terms } });

export const apiVerifyEmail = async (email, code) => {
  const data = await apiFetch("/auth/verify-email", { method:"POST", body:{ email, code } });
  saveToken(data.access_token, data.role); 
  return data;
};

export const apiResendCode   = (email) => apiFetch("/auth/resend-code", { method:"POST", body:{ email, code:"000000" } });

export const apiGetProfile   = () => apiFetch("/user/profile", { auth:true });

export const apiAdminMetrics = () => apiFetch("/administration/metrics", { auth:true });

export const apiAnalyzeUrl  = (url) => apiFetch("/analysis/url", { method:"POST", body:{ url } });

export async function apiForgotPassword(email) {
  const r = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email })
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function apiResetPassword(token, password, confirm_password) {
  const r = await fetch(`${API_BASE}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ password, confirm_password })
  });
  if (!r.ok) throw await r.json();
  return r.json();
}
