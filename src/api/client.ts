const API_BASE = import.meta.env.VITE_API_BASE as string;

const INACTIVITY_MS = 30 * 60 * 1000;
const LAST_ACTIVITY_KEY = "veracity_last_activity";

type HeadersDict = Record<string, string>;

interface FetchOptions {
  auth?: boolean;
  method?: string;
  body?: unknown;
  headers?: HeadersDict;
}

interface HttpError extends Error {
  status?: number;
  data?: unknown;
  code?: string;
  detail?: unknown;
}

function touchActivity(): void {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

function shouldExpire(): boolean {
  const last = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || "0", 10);
  if (!last) return false;
  return Date.now() - last > INACTIVITY_MS;
}

function installActivityListeners(): void {
  const evts: Array<keyof WindowEventMap> = ["click", "keydown", "mousemove", "scroll", "touchstart"];
  evts.forEach((e) =>
    window.addEventListener(e, touchActivity, { passive: true })
  );
  window.addEventListener("veracity-auth-changed", touchActivity as EventListener);
}

export function initAuthWatch(): void {
  installActivityListeners();
  touchActivity();

  if (getToken() && shouldExpire()) {
    clearToken();
  }

  setInterval(() => {
    if (getToken() && shouldExpire()) {
      clearToken();
    }
  }, 60 * 1000);
}

function notifyAuthChange(): void {
  window.dispatchEvent(new Event("veracity-auth-changed"));
}

export function saveToken(_token: string, role?: string): void {
  localStorage.setItem("veracity_token", "1"); 
  if (role) localStorage.setItem("veracity_role", role);
  notifyAuthChange();
  touchActivity();
}

export function getToken(): string | null {
  return localStorage.getItem("veracity_token");
}

export function getRole(): string | null {
  return localStorage.getItem("veracity_role");
}

export function clearToken(): void {
  localStorage.removeItem("veracity_token");
  localStorage.removeItem("veracity_role");
  notifyAuthChange();
}

export const extractErrorMessage = (data: unknown, fallback: string): string => {
  const d = (data ?? {}) as Record<string, unknown>;
  const detail = d.detail as unknown;
  const message = d.message as unknown;

  const raw =
    (typeof detail === "string" && detail) ||
    (Array.isArray(detail) && (detail[0] as any)?.msg) ||
    (typeof message === "string" && message) ||
    fallback;

  return raw === fallback ? fallback : cleanMsg(String(raw ?? ""));
};

function cleanMsg(msg: unknown): string {
  if (!msg) return "";
  return String(msg)
    .replace(/^value\s*error,\s*/i, "")
    .replace(/^type\s*error,\s*/i, "")
    .replace(/^validation\s*error:\s*/i, "")
    .trim();
}

export async function apiFetch<T = any>(
  path: string,
  { auth = false, method = "GET", body, headers }: FetchOptions = {}
): Promise<T> {
  if (auth && !getToken()) {
    clearToken();
  }
  
  if (getToken() && shouldExpire()) {
    clearToken();
  }

  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) } as HeadersDict,
    credentials: "include", 
  };

  if (body !== undefined) {
    (init as any).body = typeof body === "string" ? body : JSON.stringify(body);
  }

  touchActivity();

  const res = await fetch(`${API_BASE}${path}`, init);
  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
    }
    const msg = extractErrorMessage(data, `Erro ${res.status}`);
    const err = new Error(msg) as HttpError;
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as T;
}

export async function apiLogin(email: string, password: string): Promise<any> {
  const r = await fetch(`${API_BASE}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  let data: any = null;
  try {
    data = await r.json();
  } catch {}
  if (!r.ok) {
    const detail = (data?.detail || data || {}) as any;
    const err = new Error(detail?.message || "Falha no login") as HttpError;
    err.status = r.status;
    err.code = detail?.code;
    err.detail = detail;
    throw err;
  }
  return data;
}

export const apiLogout = () =>
  apiFetch("/v1/auth/logout", { auth: true, method: "POST" })
    .catch(() => {})
    .finally(clearToken);

export const apiRegister = (
  name: string,
  email: string,
  password: string,
  confirm_password: string,
  accepted_terms: boolean
) =>
  apiFetch("/v1/auth/register", {
    method: "POST",
    body: { name, email, password, confirm_password, accepted_terms },
  });

export const apiVerifyEmail = async (email: string | null, code: string) => {
  const target = localStorage.getItem("veracity_email_change_target");
  if (!email && target) {
    const data = await apiFetch("/v1/users/profile/email-change/confirm", {
      auth: true,
      method: "POST",
      body: { email: target, code },
    });
    return data;
  }
  const data = await apiFetch<any>("/v1/auth/verify-email", {
    method: "POST",
    body: { email, code },
  });
  saveToken(data.access_token as string, data.role as string | undefined);
  return data;
};

export const apiResendCode = (email: string | null) => {
  const target = localStorage.getItem("veracity_email_change_target");
  if (!email && target) {
    return apiFetch("/v1/users/profile/email-change/request", {
      auth: true,
      method: "POST",
      body: { email: target },
    });
  }
  return apiFetch("/v1/auth/resend-code", {
    method: "POST",
    body: { email, code: "000000" },
  });
};

export const apiGetProfile = () => apiFetch("/v1/users/profile", { auth: true });

export const apiAdminMetrics = () =>
  apiFetch("/v1/administration/metrics/month", { auth: true });

export const apiListUnifiedRequests = (
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  category?: string,
  email?: string
) => {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("page_size", String(pageSize));
  if (status) q.set("status", status);
  if (category) q.set("category", category);
  if (email) q.set("email", email);

  return apiFetch(`/v1/administration/contact-requests?${q.toString()}`, { auth: true });
};

export const apiGetUnifiedRequestDetail = (requestId: string) =>
  apiFetch(`/v1/administration/contact-requests/${requestId}`, { auth: true });

export const apiReplyContactRequest = (requestId: string, replyMessage: string) =>
  apiFetch(`/v1/administration/contact-requests/${requestId}/reply`, {
    auth: true,
    method: "POST",
    body: { reply_message: replyMessage },
  });

export const apiListTokenRequests = (
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  email?: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("page_size", String(pageSize));
  if (status) q.set("status", status);
  if (email) q.set("email", email);
  if (dateFrom) q.set("date_from", dateFrom);
  if (dateTo) q.set("date_to", dateTo);

  return apiFetch(`/v1/administration/api/token-requests?${q.toString()}`, { auth: true });
};

export const apiGetTokenRequest = (requestId: string) =>
  apiFetch(`/v1/administration/api/token-requests/${requestId}`, { auth: true });

export const apiApproveTokenRequest = (requestId: string) =>
  apiFetch(`/v1/administration/api/token-requests/${requestId}/approve`, {
    auth: true,
    method: "POST",
  });

export const apiRejectTokenRequest = (requestId: string, reason: string) =>
  apiFetch(`/v1/administration/api/token-requests/${requestId}/reject`, {
    auth: true,
    method: "POST",
    body: { reason },
  });

export const apiListTokens = (
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  email?: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("page_size", String(pageSize));
  if (status) q.set("status", status);
  if (email) q.set("email", email);
  if (dateFrom) q.set("date_from", dateFrom);
  if (dateTo) q.set("date_to", dateTo);

  return apiFetch(`/v1/administration/api/tokens?${q.toString()}`, { auth: true });
};

export const apiRevokeTokenAdmin = (tokenId: string, reason?: string) =>
  apiFetch(`/v1/administration/api/tokens/${tokenId}/revoke`, {
    auth: true,
    method: "POST",
    body: { reason },
  });

export const apiGetTokenDetailAdmin = (tokenId: string) =>
  apiFetch(`/v1/administration/api/tokens/${tokenId}`, { auth: true });

export const apiAnalyzeUrl = (url: string) =>
  apiFetch("/v1/analyses/url", { auth: true, method: "POST", body: { url } });

export async function apiAnalyzeImage(file: File): Promise<any> {
  const fd = new FormData();
  fd.append("file", file);
  touchActivity();
  const res = await fetch(`${API_BASE}/v1/analyses/image`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    if (res.status === 401) clearToken();
    const msg = extractErrorMessage(data, `Erro ${res.status}`);
    const err = new Error(msg) as HttpError;
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiForgotPassword(email: string): Promise<any> {
  const r = await fetch(`${API_BASE}/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function apiResetPassword(token: string, password: string, confirm_password: string): Promise<any> {
  const r = await fetch(`${API_BASE}/v1/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirm_password }),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function apiSendContact(email: string, subject: string, message: string, category: string) {
  return apiFetch('/v1/contact', {
    method: 'POST',
    body: { 
      email, 
      subject, 
      message, 
      category 
    },
  });
}

export const apiValidateName = (name: string) =>
  apiFetch("/v1/users/profile/name?validate_only=true", {
    auth: true,
    method: "PATCH",
    body: { name },
  });

export const apiUpdateName = (name: string) =>
  apiFetch("/v1/users/profile/name", {
    auth: true,
    method: "PATCH",
    body: { name },
  });

export const apiValidateEmailChange = (email: string) =>
  apiFetch("/v1/users/profile/email-change/request?validate_only=true", {
    auth: true,
    method: "POST",
    body: { email },
  });

export const apiRequestEmailChange = (email: string) =>
  apiFetch("/v1/users/profile/email-change/request", {
    auth: true,
    method: "POST",
    body: { email },
  });

export const apiConfirmEmailChange = (email: string, code: string) =>
  apiFetch("/v1/users/profile/email-change/confirm", {
    auth: true,
    method: "POST",
    body: { email, code },
  });

export async function apiDeleteAccount(): Promise<any> {
  const r = await fetch(`${API_BASE}/v1/users/account`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!r.ok) throw new Error(((await r.json()) as any).detail || "Falha ao excluir conta.");
  return r.json();
}

export async function apiInactivateAccount() {
  const res = await fetch(`${API_BASE}/v1/users/account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Falha ao inativar conta.");
  }

  return res.json();
}

export type AdminMonthMetrics = {
  year: number;
  month: number;
  reference: string;
  analyses: {
    bars: {
      url_malicious: number;
      url_suspicious: number;
      url_safe: number;
      image_fake: number;
      image_safe: number;
    };
    totals: {
      total_month: number;
      urls_month: number;
      images_month: number;
    };
  };
  users: {
    bars: {
      active_users: number;
      inactive_users: number;
    };
    totals: {
      total_users: number;
      active_users: number;
      inactive_users: number;
    };
  };
  tokens: {
    bars: {
      active: number;
      expired: number;
      revoked: number;
    };
    totals: {
      total_tokens: number;
      active: number;
      revoked: number;
    };
  };
  requests: {
    bars: {
      doubt: number;
      suggestion: number;
      complaint: number;
      token_request: number;
    };
    totals: {
      total_requests: number;
      doubt: number;
      suggestion: number;
      complaint: number;
      token_request: number;
    };
  };
};

export async function getAdminMonthlyMetrics(params: {
  year?: number;
  month?: number;
  signal?: AbortSignal;
}): Promise<AdminMonthMetrics> {
  const q = new URLSearchParams();
  if (params.year) q.set("year", String(params.year));
  if (params.month) q.set("month", String(params.month));

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const url = `${API_BASE}/v1/administration/metrics/month?${q.toString()}`;
  const resp = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
    signal: params.signal,
  });

  if (!resp.ok) {
    if (resp.status === 401) {
      throw new Error("Não autenticado. Faça login como administrador para ver o gráfico.");
    }
    
    let data: any = null;
    try {
      data = await resp.json();
    } catch {}

    const msg = extractErrorMessage(data, await resp.text().catch(() => "") || `Falha ao obter métricas (${resp.status})`);
    
    throw new Error(msg);
  }
  return resp.json();
}

export const apiRevealApiToken = () =>
  apiFetch<{ token: string; expires_at: string | null }>("/v1/users/api-token/reveal", {
    auth: true,
    method: "POST",
  });

export const apiRevokeApiToken = () =>
  apiFetch("/v1/users/api-token/revoke", {
    auth: true,
    method: "POST",
  });