# Visión General de la Arquitectura

## Stack tecnológico

| Capa            | Tecnología           | Versión |
|-----------------|----------------------|---------|
| Framework       | Next.js (App Router) | 16.1.1  |
| Runtime UI      | React                | 19.2.3  |
| Lenguaje        | TypeScript           | 5       |
| Estilos         | Tailwind CSS         | 4       |
| Formularios     | React Hook Form      | 7.63.0  |
| Notificaciones  | React Toastify       | 11.0.5  |
| Iconos          | FontAwesome          | 6       |
| Animaciones     | GSAP                 | 3       |
| Drop & Drag     | DND Kit              |         |

## Estructura de alto nivel

```
web-admin-panel/
├── src/
│   ├── app/          # Páginas y layouts (Next.js App Router)
│   ├── features/     # Módulos de dominio (lógica de negocio)
│   ├── shared/       # Cliente API y componentes globales
│   └── proxy.ts      # Middleware: autenticación + CSRF + refresh session
├── next.config.ts    # Configuración de Next.js
├── tsconfig.json     # Configuración de TypeScript
└── package.json
```

## Módulos de dominio (`src/features/`)

Cada dominio se organiza de forma autónoma bajo `src/features/<dominio>/`:

```
<dominio>/
├── services/     # Clases estáticas que llaman a apiFetch()
├── entities/     # Modelos de dominio
├── dtos/         # Clases abstractas para formas de request/response
├── components/   # Componentes React ('use client')
├── types/        # Tipos TypeScript
├── interfaces/   # Interfaces TypeScript
└── hooks/        # Hooks personalizados
```

Todos los módulos se exportan desde `src/features/index.ts`.

### Dominios disponibles

| Dominio | Descripción |
|---------|------------|
| `auth` | Login, logout, refresh, hook `useAuth` |
| `usuarios` | Gestión de usuarios (perfil propio + admin) |
| `articulos` | CRUD de artículos con secciones e imágenes |
| `equipo` | Gestión de empleados del equipo |
| `servicios` | Catálogo de servicios |
| `testimonios` | Testimonios de clientes |
| `proyectos` | Gestión de proyectos (SUPERADMIN) |
| `actividad` | Registro de actividad del usuario |
| `project` | Módulos de contenido con scope por proyecto |

## Cliente API (`src/shared/api/client.ts`)

Función central `apiFetch<T>(endpoint, method?, data?, credentials?, isRetry?)`:

- Envía a `${NEXT_PUBLIC_BACKEND_URL}/${endpoint}` con `credentials: 'include'`
- **401 → auto-refresh**: llama `POST /auth/refresh` y reintenta una vez (`isRetry` flag)
- **Refresh falla**: lanza `Error('Sesión expirada')`
- **204**: retorna `undefined`
- Inyecta `X-CSRF-Token` automáticamente en métodos mutantes (POST, PUT, PATCH, DELETE)

Para subida de archivos existe `apiFetchFormData<T>()` con la misma lógica pero enviando `FormData`.

## Cliente API Server (`src/shared/api/client-server.ts`)

Función `apiFetchServer<T>(endpoint, method?, data?)` diseñada exclusivamente para **Server Components, Route Handlers** de Next.js, donde las cookies no se propagan automáticamente al backend.

- Lee las cookies de la petición entrante mediante `next/headers` y las reenvía manualmente en el header `Cookie` de cada llamada al backend
- Usa `cache: 'no-store'` para garantizar datos frescos en cada render de servidor
- **401 → redirect**: a diferencia del cliente browser, no intenta renovar el token — redirige directamente a `/` (login)
- **Errores HTTP**: intenta parsear el cuerpo JSON del backend y lanza `Error` con el mensaje recibido; si el body no es JSON, construye el mensaje a partir del código HTTP
- **204 / body vacío**: retorna `undefined` (igual que `apiFetch`)
- No inyecta `X-CSRF-Token` porque las mutaciones desde el servidor no pasan por la validación CSRF del middleware

> Usar este cliente en cualquier `page.tsx` o `layout.tsx` que sea Server Component. Para componentes cliente, usar `apiFetch` de `client.ts`.

## Middleware (`src/proxy.ts`)

Ejecuta en el Edge Runtime de Next.js antes de cada request (excepto assets estáticos, imágenes y archivos públicos). Tiene tres responsabilidades principales: verificar autenticación, renovar sesiones expiradas y controlar el acceso por rol a nivel de UX.

### Guards de ruta por rol (UX)

| Prefijo | Rol mínimo |
|----------------------------------------------------|------------|
| `/superadmin`, `/project`                          | SUPERADMIN |
| `/equipo`, `/servicios`, `/usuarios`, `/historial` | ADMIN      |
| `/dashboard`, `/articulos`, `/usuario`             | USER       |

> La autorización real se aplica en el backend. El middleware solo protege la navegación de la UI.

### Logging

Cada decisión se registra en consola vía `proxyLog` con timestamp local (`[proxy] HH:MM:SS — mensaje`), útil para depurar el flujo en desarrollo.

## Flujo de autenticación

```
1. Usuario envía credenciales → POST /auth/login
2. Backend establece cookies HttpOnly: access_token + refresh_token
3. Middleware verifica access_token en cada request
4. apiFetch detecta 401 → POST /auth/refresh → reintenta
5. Si el refresh falla → lanza 'Sesión expirada' → useAuth redirige a /
```

## Variables de entorno

| Variable | Descripción | Default |
|----------|------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | URL base del backend | `http://localhost:3001` |
