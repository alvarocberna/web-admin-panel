
async function refreshSession(url: string): Promise<boolean> {
  const res = await fetch(`${url}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
  });
  console.log("res: " + res)
  return res.ok;
}

export async function apiFetch<T>(
    endpoint: string,
    method?: string,
    data?: any,
    credentials: RequestCredentials = 'include',
    isRetry = false //evita loop infinito
): Promise<T>{
    
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    //realizamos el fetch 
    const res = await fetch(`${url}/${endpoint}`, { 
        method: method,
        credentials: credentials,
        headers: {'Content-Type': 'application/json'},
        body: data ? JSON.stringify(data) : undefined,
    })

    //capturamos res 401 (access token expirado) y reintentamos refresh token
    if (res.status === 401 && !isRetry) {
        console.log("Status 401: Se reintentará refresh el token")
        const refreshed = await refreshSession(url!);
        if (refreshed) {
        //reintenta la request original
            console.log("Token refreshed, se reintentará hacer la consulta al endpoint")
            return apiFetch<T>(endpoint, method, data, credentials, true); //???
        }
        //refresh falló -> logout
        console.log("Token no fue refreshed")
        throw new Error('Sesión expirada');
    }

    //si recibimos res status 400 o 500, lanzamos error
    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json(); //parsear el cuerpo como JSON
        } catch (error) {
            errorData = { message: `Error HTTP ${res.status}: ${res.statusText}` };
        }
        throw new Error(errorData?.message || errorData?.error || `Error HTTP ${res.status}`);
    }

    //si recibismo res status 204 No Content, no hay cuerpo para parsear
    if (res.status === 204) {
        return undefined as T;
    }

    //verificamos si el cuerpo está vacío
    const contentLength = res.headers.get('content-length');
    if (contentLength === '0' || res.status === 200) {
        const text = await res.text();
        if (!text) {
            return undefined as T;
        }
        return JSON.parse(text) as Promise<T>;
    }

    //todo todo sale bien, devolvemos res como json
    return res.json() as Promise<T>;

}

