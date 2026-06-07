# Enrutamiento

## App Router de Next.js

El proyecto usa el **App Router** de Next.js 16. Las rutas se definen por la estructura de `src/app/`.

## Mapa de rutas

| Ruta | Rol mínimo | Propósito |
|------|-----------|-----------|
| `/` | Pública | Login |
| `/dashboard` | USER | Panel principal con resumen |
| `/articulos` | USER | Listado y configuración de artículos |
| `/articulos/crear` | USER | Crear nuevo artículo |
| `/articulos/[articuloId]/ver` | USER | Ver detalle de artículo |
| `/articulos/[articuloId]/modificar` | USER | Editar artículo |
| `/usuario` | USER | Perfil del usuario autenticado |
| `/equipo` | ADMIN | Gestión del equipo |
| `/servicios` | ADMIN | Gestión de servicios |
| `/testimonios` | ADMIN | Gestión de testimonios |
| `/usuarios` | ADMIN | Gestión de usuarios del proyecto |
| `/actividad` | ADMIN | Historial de actividad |
| `/superadmin` | SUPERADMIN | Panel de proyectos |
| `/project` | SUPERADMIN | Vista de contenido por proyecto |
| `/project/equipo` | SUPERADMIN | Equipo del proyecto seleccionado |
| `/project/servicios` | SUPERADMIN | Servicios del proyecto seleccionado |
| `/project/articulos/[articuloId]` | SUPERADMIN | Artículo del proyecto seleccionado |

## Middleware (`src/proxy.ts`)

El middleware intercepta **todas las rutas** antes de renderizar.

### Lógica de flujo

```
Request entrante
  │
  ├─ Ruta pública (/)?
  │    ├─ Sí + tiene access_token → redirect /dashboard
  │    └─ Sí + sin token → deja pasar (página de login)
  │
  └─ Ruta protegida
       ├─ Sin access_token Y sin refresh_token → redirect /
       ├─ Solo refresh_token (sin access) → deja pasar (apiFetch hará el refresh)
       └─ Con access_token → verifica rol del JWT
            ├─ Ruta de SUPERADMIN + rol insuficiente → redirect /dashboard
            ├─ Ruta de ADMIN + rol insuficiente → redirect /dashboard
            └─ OK → deja pasar + inyecta cookie CSRF
```

### CSRF

El middleware genera un token UUID con `crypto.randomUUID()` y lo almacena en la cookie `csrf_token` (no-HttpOnly, legible por JS). El cliente lo lee y lo envía como header `X-CSRF-Token` en cada petición mutante.

## Layouts

```
app/
├── layout.tsx           # Root layout: html, body, fuentes, ToastProvider
├── page.tsx             # / (login)
└── (admin)/             # Route group — no afecta las URLs
    ├── layout.tsx       # Layout compartido: NavbarAdmin + shell de página
    ├── dashboard/page.tsx
    ├── articulos/page.tsx
    ├── articulos/crear/page.tsx
    ├── articulos/[articuloId]/ver/page.tsx
    ├── articulos/[articuloId]/modificar/page.tsx
    ├── equipo/page.tsx
    ├── servicios/page.tsx
    ├── testimonios/page.tsx
    ├── usuarios/page.tsx
    ├── actividad/page.tsx
    ├── perfil/page.tsx
    └── superadmin/page.tsx
```

Todas las rutas protegidas viven dentro del route group `(admin)`. Su `layout.tsx` monta `NavbarAdmin` una sola vez y lo preserva entre navegaciones — el navbar no se desmonta al cambiar de ruta. El componente `ContenedorAdmin` fue eliminado.

## Parámetros de ruta

Las rutas dinámicas usan el segmento `[articuloId]`. Los componentes de cliente acceden al parámetro con `useParams()`:

```tsx
const { articuloId } = useParams<{ articuloId: string }>()
```

## Rewrites (next.config.ts)

```ts
'/api/:path*'  →  '${NEXT_PUBLIC_BACKEND_URL}/:path*'
```

Esto permite llamar al backend desde el cliente usando `/api/...` como alternativa, aunque el proyecto usa `apiFetch` directamente con la URL completa del backend.
