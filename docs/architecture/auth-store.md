# authStore — Estado Global de Autenticación

Store Zustand que centraliza el estado del usuario autenticado para todos los componentes cliente del panel de administración. Evita llamadas redundantes a `GET /usuario/authenticated` y elimina prop drilling de datos de usuario entre componentes.

## Archivos

| Rol | Ruta |
|-----|------|
| Store (Zustand) | `src/features/auth/store/auth.store.ts` |
| Provider (inicialización) | `src/features/auth/components/auth-provider.component.tsx` |
| Hook selector | `src/features/auth/hooks/use-auth.ts` |
| Layout (punto de montaje) | `src/app/(admin)/layout.tsx` |

## Estado

```typescript
interface AuthState {
  user: UsuarioEntity | null   // datos completos del usuario
  loading: boolean             // true mientras se obtiene el usuario
  error: string | null         // mensaje de error si la sesión falla
  isAuthenticated: boolean     // true cuando user !== null
}
```

## Acciones

| Acción | Cuándo usarla |
|--------|--------------|
| `setUser(user)` | Interna — la usa `AuthProvider` al recibir respuesta del backend |
| `setLoading(bool)` | Interna — la usa `AuthProvider` al iniciar/terminar el fetch |
| `setError(msg)` | Interna — la usa `AuthProvider` si el fetch falla |
| `clearAuth()` | Llamar en logout para limpiar el store antes de redirigir |

## Flujo de inicialización

```
AdminLayout (Server Component)
  └── AuthProvider (Client Component — montado una sola vez por sesión)
        └── useEffect → GET /usuario/authenticated
              ├── OK  → setUser(usuario)
              └── ERR → setError(msg) + redirect '/' si 'Sesión expirada'
```

El layout del admin (`src/app/(admin)/layout.tsx`) persiste durante toda la navegación dentro de la sección admin (Next.js App Router no remonta layouts en rutas anidadas). Por eso el fetch ocurre **una única vez** por sesión, no en cada cambio de ruta.

## Cómo leer el estado

### Opción 1 — `useAuth()` (recomendado para la mayoría de componentes)

```typescript
import { useAuth } from '@/features'

function MiComponente() {
  const { user, loading, isAuthenticated } = useAuth()
  // ...
}
```

### Opción 2 — `useAuthStore` con selector fino (recomendado si solo se necesita un campo)

```typescript
import { useAuthStore } from '@/features'

function MiComponente() {
  const rol = useAuthStore((s) => s.user?.rol)
  // solo se re-renderiza cuando cambia el rol, no todo el user
}
```

## Logout

El componente `NavbarAdmin` ya llama `clearAuth()` antes de redirigir a `/`:

```typescript
const clearAuth = useAuthStore((s) => s.clearAuth)

const logout = async () => {
  await AuthService.logout()
  clearAuth()           // limpia el store
  router.push('/')
}
```

Esto garantiza que si el usuario vuelve a iniciar sesión en la misma pestaña, el `AuthProvider` vea el store vacío y realice un nuevo fetch.

## Qué NO reemplaza este store

Los **Server Components** (páginas, card-components del dashboard, `ArticulosContent`) continúan usando `UsuarioService` del servidor (`usuario.server.service.ts`). Zustand es exclusivamente cliente — no tiene acceso durante el render de servidor, por lo que el SSR sería incorrecto si se eliminaran esos fetches server-side.

| Contexto | Fuente de datos |
|----------|----------------|
| Server Components | `UsuarioService` (server) — fetch con cookies del request |
| Client Components | `useAuthStore` / `useAuth()` — estado hidratado por `AuthProvider` |

## Ventajas vs. implementación anterior

| Aspecto | Antes | Después |
|---------|-------|---------|
| Fetch de usuario en cliente | `useEffect` en `useAuth()`, disparado en cada mount del navbar | Una sola vez en `AuthProvider` al entrar al admin |
| Componentes cliente con datos de usuario | Solo `NavbarAdmin` (via `useAuth`) | Cualquier componente cliente puede suscribirse sin fetch adicional |
| Logout | Solo limpiaba cookies en backend | También limpia el store para evitar datos obsoletos |
| `useAuth()` hook | `useState` + `useEffect` + llamada API | Selector puro del store (sin efectos secundarios) |
