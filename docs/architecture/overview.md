# Visión General de la Arquitectura

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| Runtime UI | React | 19.2.3 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS | 4 |
| Formularios | React Hook Form | 7.63.0 |
| Notificaciones | React Toastify | 11.0.5 |
| Iconos | FontAwesome | 6 |

## Estructura de alto nivel

```
web-admin-panel/
├── src/
│   ├── app/          # Páginas y layouts (Next.js App Router)
│   ├── features/     # Módulos de dominio (lógica de negocio)
│   ├── shared/       # Cliente API y componentes globales
│   └── proxy.ts      # Middleware: autenticación + CSRF
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

## Middleware (`src/proxy.ts`)

- **Ruta pública:** `/` (login)
- **Rutas protegidas:** todas las demás — requieren cookie `access_token`
- **CSRF:** genera UUID vía `crypto.randomUUID()` como cookie no-HttpOnly (legible por JS)
- Decodifica el payload JWT (sin verificación) para leer el claim `rol`
- Redirige `/` → `/dashboard` si el usuario ya está autenticado
- Redirige a `/` si el token no existe

### Guards de ruta por rol (UX)

| Prefijo | Rol mínimo |
|---------|-----------|
| `/superadmin`, `/project` | SUPERADMIN |
| `/equipo`, `/servicios`, `/usuarios`, `/actividad` | ADMIN |
| `/dashboard`, `/articulos`, `/usuario` | USER |

> La autorización real se aplica en el backend. El middleware solo protege la navegación de la UI.

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
