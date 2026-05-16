import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Responsabilidades Proxy
// 1) Verifica la auth mediante JWT 
// 2) extrae el rol del payload para controlar el acceso a UX
// 3) Maneja res status 401

// Funciones auxiliares
// | Función                   | Descripción                                                                                     |
// |---------------------------|-------------------------------------------------------------------------------------------------|
// | `decodeJwtPayload(token)` | Decodifica el payload Base64 del JWT sin verificar firma — solo para leer claims (`rol`, `exp`) |
// | `isTokenExpired(token)`   | Retorna `true` si el JWT expiró o es inválido (con margen de 10 s)                              |
// | `attemptRefresh(request)` | Llama a `POST /auth/refresh` desde el servidor, fusiona las cookies nuevas con las existentes y devuelve un `NextResponse` que actualiza el header `Cookie` para Server Components y envía `Set-Cookie` al browser |

// Flujo de decisión por request
// ```
// 1. Ruta termina en "/" (no raíz ni _next/) → 404
// 2. Ruta pública (/) + access_token válido y no expirado → redirect /dashboard
// 3. Ruta pública sin sesión válida → permitir (mostrar login)
// 4. Ruta protegida sin ningún token → redirect /
// 5. Ruta protegida sin access_token pero con refresh_token → attemptRefresh()
//      ├─ éxito → continuar con sesión renovada
//      └─ fallo → redirect /
// 6. Ruta protegida con access_token expirado + refresh_token → attemptRefresh() preventivo
//      ├─ éxito → continuar con sesión renovada
//      └─ fallo → redirect /
// 7. Guard de rol (UX):
//      • /superadmin, /project → solo SUPERADMIN (USER/ADMIN → redirect /dashboard)
//      • /equipo, /servicios, /usuarios, /historial → mínimo ADMIN (USER → redirect /dashboard)
// 8. Todo OK → NextResponse.next()


/** Decodifica el payload de un JWT sin verificar firma (solo lectura de claims). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

/** Devuelve true si el JWT está expirado o es inválido (con 10s de margen). */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return Date.now() / 1000 > payload.exp - 10;
}

/**
 * Llama a /auth/refresh desde el servidor usando las cookies de la request actual.
 *
 * Si tiene éxito devuelve un NextResponse que:
 *   - actualiza el header Cookie de la request hacia los server components (cookies() lo ve)
 *   - reenvía los Set-Cookie al browser para que persistan las nuevas cookies
 *
 * Si falla devuelve null.
 */
async function attemptRefresh(request: NextRequest): Promise<NextResponse | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  let refreshRes: Response;
  try {
    refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });
  } catch {
    return null;
  }

  if (!refreshRes.ok) return null;

  // Extraer los Set-Cookie del backend (getSetCookie maneja múltiples cookies)
  const setCookies: string[] =
    typeof (refreshRes.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function'
      ? (refreshRes.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : refreshRes.headers.get('set-cookie')
        ? [refreshRes.headers.get('set-cookie')!]
        : [];

  if (setCookies.length === 0) return null;

  // Combinar las cookies existentes con los nuevos valores del refresh
  const merged: Record<string, string> = {};
  (request.headers.get('cookie') || '').split(';').forEach(chunk => {
    const eqIdx = chunk.indexOf('=');
    if (eqIdx === -1) return;
    merged[chunk.slice(0, eqIdx).trim()] = chunk.slice(eqIdx + 1).trim();
  });
  setCookies.forEach(raw => {
    const [nameValue] = raw.split(';');
    const eqIdx = nameValue.indexOf('=');
    if (eqIdx === -1) return;
    merged[nameValue.slice(0, eqIdx).trim()] = nameValue.slice(eqIdx + 1).trim();
  });

  const updatedCookieHeader = Object.entries(merged)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');

  // Pasar las cookies actualizadas a los server components vía request headers
  const newHeaders = new Headers(request.headers);
  newHeaders.set('cookie', updatedCookieHeader);

  const response = NextResponse.next({ request: { headers: newHeaders } });

  // Reenviar Set-Cookie al browser para que actualice sus cookies
  setCookies.forEach(raw => response.headers.append('Set-Cookie', raw));

  return response;
}

/** Rutas que requieren rol ADMIN o SUPERADMIN (solo UX, la seguridad real está en el backend). */
const superadminRoutes = ['/superadmin', '/project'];
const adminRoutes = ['/equipo', '/servicios', '/usuarios', '/historial'];
// const userRoutes = ['/usuarios']

// export function proxy(request: NextRequest) {
//     return NextResponse.next();
// }

const proxyLog = (msg: string) => {
  const time = new Date().toLocaleTimeString('es-CL', { hour12: false });
  console.log(`[proxy] ${time} — ${msg}`);
};


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bloquear directory browsing - denegar acceso a rutas que terminan en /
  // excepto la raíz y rutas de páginas válidas
  if (pathname.endsWith('/') && pathname !== '/') {
    // Verificar si es una ruta de directorio estático de Next.js
    if (pathname.startsWith('/_next/')) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Rutas públicas que NO requieren autenticación
  const publicRoutes = ['/'];

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Verificar tokens en cookies
  const accessToken  = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  proxyLog(`${pathname} | access_token: ${accessToken ? '✓' : '✗'} | refresh_token: ${refreshToken ? '✓' : '✗'}`);

  // Ruta pública (login): redirigir al dashboard solo si la sesión es realmente válida
  if (isPublicRoute && accessToken && !isTokenExpired(accessToken.value)) {
    proxyLog(`ruta pública con access_token válido → redirect /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si es una ruta pública y no hay sesión válida, permitir el acceso
  if (isPublicRoute) {
    proxyLog(`ruta pública → permitido`);
    return NextResponse.next();
  }

  // Para rutas protegidas: si no hay ningún token, redirigir al login
  if (!accessToken && !refreshToken) {
    proxyLog(`ruta protegida sin tokens → redirect /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // access_token ausente pero refresh_token presente → intentar refresh
  if (!accessToken && refreshToken) {
    proxyLog(`access_token ausente → intentando refresh`);
    const refreshed = await attemptRefresh(request);
    if (refreshed) {
      proxyLog(`refresh exitoso → sesión renovada`);
      return refreshed;
    }
    proxyLog(`refresh fallido → redirect /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // access_token presente pero expirado → intentar refresh preventivo
  if (accessToken && isTokenExpired(accessToken.value) && refreshToken) {
    proxyLog(`access_token expirado → intentando refresh preventivo`);
    const refreshed = await attemptRefresh(request);
    if (refreshed) {
      proxyLog(`refresh preventivo exitoso → sesión renovada`);
      return refreshed;
    }
    proxyLog(`refresh preventivo fallido → redirect /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Verificar restricción por rol (solo UX, la seguridad real está en el backend)
  const isSuperadminRoute = superadminRoutes.some(route => pathname.startsWith(route));
  if (isSuperadminRoute && accessToken) {
    const payload = decodeJwtPayload(accessToken.value);
    const rol = payload?.rol as string | undefined;
    if (rol === 'USER' || rol === 'ADMIN') {
      proxyLog(`ruta superadmin con rol USER o ADMIN → redirect /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Verificar restricción por rol (solo UX, la seguridad real está en el backend)
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdminRoute && accessToken) {
    const payload = decodeJwtPayload(accessToken.value);
    const rol = payload?.rol as string | undefined;
    if (rol === 'USER') {
      proxyLog(`ruta admin con rol USER → redirect /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  proxyLog(`ruta protegida con sesión → permitido`);
  return NextResponse.next();
}

// Configurar para qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - archivos públicos (png, jpg, jpeg, gif, svg, webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|mp4|webm|ogg|mov)$).*)',
  ],
};
