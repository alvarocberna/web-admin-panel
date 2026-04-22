import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// verifica 1) la auth mediante los jwt y 2) extrae el rol del payload para controlar el acceso a UX

/** Decodifica el payload de un JWT sin verificar firma (solo lectura de claims). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
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


export function proxy(request: NextRequest) {
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

  // Si es la ruta de login (/) y el usuario YA está autenticado, redirigir al dashboard
  if (isPublicRoute && accessToken) {
    proxyLog(`ruta pública con access_token activo → redirect /dashboard`);
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Si es una ruta pública y no está autenticado, permitir el acceso
  if (isPublicRoute) {
    proxyLog(`ruta pública sin sesión → permitido`);
    return NextResponse.next();
  }

  // Para rutas protegidas: si no hay ningún token, redirigir al login
  if (!accessToken && !refreshToken) {
    proxyLog(`ruta protegida sin tokens → redirect /`);
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si solo falta el access_token pero hay refresh_token, dejar pasar:
  // client.ts recibirá un 401 y ejecutará el refresh automáticamente
  if (!accessToken && refreshToken) {
    proxyLog(`access_token ausente pero refresh_token presente → permitido para que client.ts refresque`);
    return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
};
