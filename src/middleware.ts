import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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
  
  // Verificar si existe el access_token en las cookies
  const accessToken = request.cookies.get('access_token');

  // Si es la ruta de login (/) y el usuario YA está autenticado, redirigir al dashboard
  if (isPublicRoute && accessToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Si es una ruta pública y no está autenticado, permitir el acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Para rutas protegidas, verificar autenticación
  // Si no hay token, redirigir al login (página raíz)
  if (!accessToken) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, permitir el acceso
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
