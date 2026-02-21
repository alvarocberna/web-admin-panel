const getBaseUrl = () => {
  // En el browser → usa rewrite de Next
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // En el servidor (SSR / server actions)
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

async function refreshSession(): Promise<boolean> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  return res.ok;
}

export async function apiFetch<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  credentials: RequestCredentials = 'include',
  isRetry = false // evita loop infinito
): Promise<T> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/${endpoint}`, {
    method,
    credentials,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });

  // 🔁 Manejo de access token expirado
  if (res.status === 401 && !isRetry) {
    const refreshed = await refreshSession();

    if (refreshed) {
      return apiFetch<T>(endpoint, method, data, credentials, true);
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

export async function apiFetchFormData<T>(
  endpoint: string,
  formData: FormData,
  method: string = 'POST',
  credentials: RequestCredentials = 'include',
  isRetry = false
): Promise<T> {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/${endpoint}`, {
    method,
    credentials,
    body: formData,
  });

  // 🔁 refresh si 401
  if (res.status === 401 && !isRetry) {
    const refreshed = await refreshSession();

    if (refreshed) {
      return apiFetchFormData<T>(
        endpoint,
        formData,
        method,
        credentials,
        true
      );
    }

    throw new Error('Sesión expirada');
  }

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

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}