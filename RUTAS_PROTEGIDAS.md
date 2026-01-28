
# Sistema de Rutas Protegidas

Este proyecto implementa un sistema de autenticación basado en cookies con protección de rutas mediante Next.js middleware.

## Arquitectura

### 1. Middleware (`src/middleware.ts`)

El middleware intercepta todas las peticiones antes de que lleguen a las páginas y:

- **Rutas públicas** (`/`): Permite acceso sin autenticación
  - Si un usuario autenticado intenta acceder al login, lo redirige automáticamente a `/dashboard`
  
- **Rutas protegidas** (todas excepto `/`): Requieren autenticación
  - Verifica la presencia de la cookie `access_token`
  - Si no hay token, redirige al login (`/`)
  - Si hay token, permite el acceso

### 2. Flujo de Autenticación

```
Usuario ingresa credenciales
    ↓
AuthService.login() llama al backend
    ↓
Backend establece cookies (access_token, refresh_token)
    ↓
Middleware detecta access_token
    ↓
Usuario accede a rutas protegidas
```

### 3. Refresh Token Automático

El cliente API (`src/shared/api/client.ts`) maneja automáticamente la renovación de tokens:

- Cuando detecta un error 401, llama a `/auth/refresh`
- Si el refresh es exitoso, reintenta la petición original
- Si falla, lanza error "Sesión expirada" y el usuario debe volver a autenticarse

### 4. Logout

Al hacer logout:
- Se llama a `AuthService.logout()` que notifica al backend
- El backend elimina las cookies
- El usuario es redirigido a `/` (login)
- El middleware bloqueará accesos futuros a rutas protegidas

## Rutas del Proyecto

### Rutas Públicas
- `/` - Página de inicio de sesión

### Rutas Protegidas
- `/dashboard` - Panel principal (redirección después de login)
- `/articulos` - Gestión de artículos
  - `/articulos/crear` - Crear artículo
  - `/articulos/[articuloId]/ver` - Ver artículo
  - `/articulos/[articuloId]/modificar` - Editar artículo
- `/usuarios` - Gestión de usuarios
  - `/usuarios/crear` - Crear usuario
  - `/usuarios/[usuarioId]/modificar` - Editar usuario
- `/actividad` - Historial de actividades

## Uso del Hook useAuth

Para componentes que necesitan información del usuario autenticado:

```typescript
import { useAuth } from '@/features';

function MiComponente() {
  const { user, loading, error, isAuthenticated } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>No autenticado</div>;

  return <div>Bienvenido, {user.nombre}</div>;
}
```

## Configuración de Seguridad

El middleware está configurado para:
- Excluir rutas de Next.js internas (`_next/*`, archivos estáticos)
- Proteger todas las rutas de la aplicación excepto `/`
- Permitir acceso a archivos públicos (imágenes, favicon)

## Roles de Usuario

Actualmente el sistema protege rutas para usuarios con rol 'admin' o 'user'. Ambos roles tienen acceso a todas las rutas protegidas. Si necesitas implementar rutas específicas por rol:

1. Actualiza el middleware para verificar el rol del usuario
2. Decodifica el JWT o consulta al backend para obtener el rol
3. Redirige según permisos específicos

## Consideraciones de Seguridad

- Las cookies son httpOnly y secure (en producción con HTTPS)
- El access_token tiene una duración limitada
- El refresh_token permite renovar sesiones sin requerir login
- El middleware verifica TODAS las peticiones, no solo navegación cliente
