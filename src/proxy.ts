import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//     return NextResponse.next();
// }

const proxyLog = (msg: string) => {
  const time = new Date().toLocaleTimeString('es-CL', { hour12: false });
  console.log(`[proxy] ${time} — ${msg}`);
};

/** Adjunta un token CSRF (Double Submit Cookie) a la respuesta si aún no existe. */
function withCsrfCookie(response: NextResponse, request: NextRequest): NextResponse {
  const existing = request.cookies.get('csrf_token');
  if (!existing) {
    const token = crypto.randomUUID();
    response.cookies.set('csrf_token', token, {
      httpOnly: false,                                         // debe ser legible por JS
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    proxyLog(`csrf_token generado → ${token.slice(0, 8)}…`);
  }
  return response;
}

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
  }

  proxyLog(`ruta protegida con sesión → permitido`);
  return withCsrfCookie(NextResponse.next(), request);
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
