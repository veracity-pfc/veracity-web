const API_BASE = import.meta.env.VITE_API_BASE;

export function saveToken(token, role) {
  localStorage.setItem("veracity_token", token);
  if (role) localStorage.setItem("veracity_role", role);
}
export function getToken() {
  return localStorage.getItem("veracity_token");
}
export function getRole() {
  return localStorage.getItem("veracity_role");
}
export function clearToken() {
  localStorage.removeItem("veracity_token");
  localStorage.removeItem("veracity_role");
}

export async function apiFetch(path, { auth = false, method = "GET", body, headers } = {}) {
  const init = {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  };
  if (auth) {
    const token = getToken();
    if (token) init.headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, init);
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Erro ${res.status}`;
    const err = new Error(msg); err.status = res.status; err.data = data; throw err;
  }
  return data;
}

export const apiLogin = (email, password) =>
    apiFetch("/auth/login", { method: "POST", body: { email, password } });

export const apiLogout = () =>
    apiFetch("/auth/logout", { auth: true, method: "POST" });

export const apiGetProfile = () => 
    apiFetch("/user/profile", { auth: true });


export const apiGetHistory = () => apiFetch("/user/history", { auth: true });
export const apiAdminMetrics = () => apiFetch("/administration/metrics", { auth: true });
export const apiAnalyzeLink = (url) => apiFetch("/analysis/link", { method: "POST", body: { url } });
