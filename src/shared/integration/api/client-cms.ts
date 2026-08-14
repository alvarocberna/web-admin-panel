const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Lee el CSRF token de la cookie; si no existe, lo solicita al backend. */
async function ensureCsrfToken(): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  try {
    const res = await fetch('/api/auth/csrf-token', { credentials: 'include' });
    if (res.ok) {
      const data: { csrfToken: string } = await res.json();
      return data.csrfToken ?? null;
    }
  } catch {
    // silent fail — la request mutante simplemente irá sin token
  }
  return null;
}

const getBaseUrl = () => {
  // En el browser → usa rewrite de Next
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // En el servidor (SSR / server actions)
  return process.env.NEXT_PUBLIC_BACKEND_CMS_URL || 'http://localhost:3001';
};

const tokenLog = (msg: string) => {
  const time = new Date().toLocaleTimeString('es-CL', { hour12: false });
  console.log(`[auth] ${time} — ${msg}`);
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (refreshPromise) {
    tokenLog('refresh ya en curso, esperando resultado...');
    return refreshPromise;
  }

  tokenLog('iniciando refresh de sesión');

  const refreshHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrfForRefresh = await ensureCsrfToken();
  if (csrfForRefresh) refreshHeaders['X-CSRF-Token'] = csrfForRefresh;

  refreshPromise = fetch(`${getBaseUrl()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: refreshHeaders,
  })
    .then(res => {
      tokenLog(res.ok ? 'refresh exitoso — nueva sesión activa' : `refresh fallido — status ${res.status}`);
      return res.ok;
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

export async function apiFetchCMS<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  credentials: RequestCredentials = 'include',
  isRetry = false // evita loop infinito
): Promise<T> {
  const baseUrl = getBaseUrl();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (MUTATING_METHODS.has(method.toUpperCase())) {
    const csrf = await ensureCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${baseUrl}/${endpoint}`, {
    method,
    credentials,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  // 🔁 Manejo de access token expirado
  if (res.status === 401 && !isRetry) {
    const refreshed = await refreshSession();

    if (refreshed) {
      return apiFetchCMS<T>(endpoint, method, data, credentials, true);
    }

    throw new Error('Sesión expirada');
  }

  // ❌ errores HTTP
  if (!res.ok) {
    let errorData: any;

    try {
      errorData = await res.json();
    } catch {
      errorData = { message: `Error HTTP ${res.status}: ${res.statusText}` };
    }

    throw new Error(
      errorData?.message ||
        errorData?.error ||
        `Error HTTP ${res.status}`
    );
  }

  // ✅ 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  // ✅ cuerpo vacío
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

// export async function apiFetchFormData<T>(
//   endpoint: string,
//   formData: FormData,
//   method: string = 'POST',
//   credentials: RequestCredentials = 'include',
//   isRetry = false
// ): Promise<T> {
//   const baseUrl = getBaseUrl();

//   const headers: Record<string, string> = {};
//   if (MUTATING_METHODS.has(method.toUpperCase())) {
//     const csrf = await ensureCsrfToken();
//     if (csrf) headers['X-CSRF-Token'] = csrf;
//   }

//   const res = await fetch(`${baseUrl}/${endpoint}`, {
//     method,
//     credentials,
//     headers: Object.keys(headers).length ? headers : undefined,
//     body: formData,
//   });

//   // 🔁 refresh si 401
//   if (res.status === 401 && !isRetry) {
//     const refreshed = await refreshSession();

//     if (refreshed) {
//       return apiFetchFormData<T>(
//         endpoint,
//         formData,
//         method,
//         credentials,
//         true
//       );
//     }

//     throw new Error('Sesión expirada');
//   }

//   if (!res.ok) {
//     let errorData: any;

//     try {
//       errorData = await res.json();
//     } catch {
//       errorData = { message: `Error HTTP ${res.status}: ${res.statusText}` };
//     }

//     throw new Error(
//       errorData?.message ||
//         errorData?.error ||
//         `Error HTTP ${res.status}`
//     );
//   }

//   if (res.status === 204) {
//     return undefined as T;
//   }

//   const text = await res.text();
//   if (!text) {
//     return undefined as T;
//   }

//   return JSON.parse(text) as T;
// }