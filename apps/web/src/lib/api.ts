// ══════════════════════════════════════════════════════════
//  AXTO Web — API Client
// ══════════════════════════════════════════════════════════
const BASE = import.meta.env.VITE_API_URL ?? 'https://api.axto.dev'

// Retrieve auth state from Zustand store / localStorage
function getToken(): string | null {
  return localStorage.getItem('axto_token')
}
function getSessionId(): string | null {
  return localStorage.getItem('axto_session_id')
}
function getTabId(): string {
  let id = sessionStorage.getItem('axto_tab_id')
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('axto_tab_id', id) }
  return id
}

async function request<T>(
  path:    string,
  method:  string = 'GET',
  body?:   unknown,
  auth:    boolean = true,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    const sid = getSessionId()
    if (sid) headers['X-Session-Id'] = sid
    headers['X-Tab-Id'] = getTabId()
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })

  // Session conflict → tab blocker
  if (res.status === 409) {
    window.dispatchEvent(new CustomEvent('axto:session-conflict'))
    throw new Error('SESSION_CONFLICT')
  }
  // Expired → redirect to login
  if (res.status === 401) {
    localStorage.removeItem('axto_token')
    window.dispatchEvent(new CustomEvent('axto:auth-expired'))
    throw new Error('UNAUTHORIZED')
  }

  const data = await res.json() as T
  if (!res.ok) throw data
  return data
}

// ── Auth ──────────────────────────────────────────────────
export const api = {
  auth: {
    login: (username: string, password: string, totp?: string) =>
      request<{ token: string; expiresAt: number; user: unknown }>(
        '/v1/auth/login', 'POST', { username, password, totp, tabId: getTabId() }, false
      ),
    logout: () => request('/v1/auth/logout', 'POST'),
    me:     () => request<{ user: unknown }>('/v1/auth/me'),
    claimTab: () => request<{ token: string; sessionId: string }>('/v1/auth/claim-tab', 'POST'),
  },

  credits: {
    balance: () => request<{ credits: number }>('/v1/credits/balance'),
    history: () => request<{ transactions: unknown[] }>('/v1/credits/history'),
  },

  jobs: {
    create: (workspace: string, tool: string, prompt?: string, params?: Record<string, unknown>) =>
      request<{ jobId: string; status: string; creditCost: number; expiresAt: string }>(
        '/v1/jobs', 'POST', { workspace, tool, prompt, params }
      ),
    list:   (workspace?: string) => request<{ jobs: unknown[] }>(`/v1/jobs${workspace ? `?workspace=${workspace}` : ''}`),
    get:    (id: string) => request<unknown>(`/v1/jobs/${id}`),
  },

  admin: {
    stats:       () => request<unknown>('/v1/admin/stats'),
    users:       () => request<{ users: unknown[] }>('/v1/admin/users'),
    pricing:     () => request<{ rules: unknown[] }>('/v1/admin/pricing'),
    updateMarkup: (id: string, markup_x: number) => request(`/v1/admin/pricing/${id}`, 'PATCH', { markup_x }),
    addCredits:  (userId: string, delta: number, note?: string) => request(`/v1/admin/users/${userId}/credits`, 'PATCH', { delta, note }),
    setStatus:   (userId: string, is_active: number) => request(`/v1/admin/users/${userId}/status`, 'PATCH', { is_active }),
    killSession: (userId: string) => request(`/v1/admin/sessions/${userId}`, 'DELETE'),
    securityLog: () => request<{ events: unknown[] }>('/v1/admin/security/events'),
  },

  pool: {
    gpu:        () => request<{ nodes: unknown[] }>('/v1/pool/gpu'),
    scaleGpu:   (action: 'up'|'down', count?: number) => request('/v1/pool/gpu/scale', 'POST', { action, count }),
    ai:         () => request<{ models: unknown[] }>('/v1/pool/ai'),
    toggleAi:   (id: string, enabled: boolean) => request(`/v1/pool/ai/${id}/toggle`, 'PATCH', { enabled }),
  },
}
