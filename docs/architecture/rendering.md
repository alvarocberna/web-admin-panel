# Estrategia de Renderizado

## Modelo general

Este proyecto usa el **App Router de Next.js 16**. Por defecto, todos los componentes son **Server Components** a menos que incluyan la directiva `'use client'`.

En la práctica, casi toda la lógica de datos y estado ocurre en el cliente porque:
- La autenticación es completamente basada en cookies del navegador
- Los datos se obtienen desde el cliente con `apiFetch()` que requiere acceso a cookies
- Los formularios interactivos usan `react-hook-form`

## Por tipo de componente

### Server Components (sin directiva)

Usados solo para:
- **Layouts** (`app/layout.tsx`, `app/dashboard/layout.tsx`, etc.) — definen estructura HTML
- **Pages sin datos dinámicos** — envuelven el componente de cliente correspondiente

Los layouts no buscan datos; delegan el fetch a los componentes cliente hijos.

### Client Components (`'use client'`)

Toda la lógica real vive aquí:
- Llamadas a `apiFetch()` dentro de `useEffect` o handlers
- Formularios con `react-hook-form`
- Gestión de estado local con `useState`
- Hooks como `useAuth`, `useRouter`

### Patrón típico de una página

```tsx
// app/equipo/page.tsx  (Server Component — solo estructura)
import { EmpleadosClient } from '@/features'

export default function EquipoPage() {
  return <EmpleadosClient />
}

// features/equipo/components/empleados.tsx  (Client Component)
'use client'
export function EmpleadosClient() {
  const [equipo, setEquipo] = useState<EquipoEntity | null>(null)

  useEffect(() => {
    EquipoService.getEquipo().then(setEquipo)
  }, [])

  // ...render
}
```

## Fetch de datos

| Escenario | Método |
|-----------|--------|
| Lectura inicial de una página | `useEffect` + `apiFetch` en el cliente |
| Mutaciones (crear/editar/eliminar) | Handler del formulario + `apiFetch` |
| Archivos e imágenes | `apiFetchFormData` con `FormData` |
| Usuario autenticado actual | `useAuth()` hook (llama a `GET /usuario/user/authenticated`) |

No se usa `fetch` del servidor ni `cache` de Next.js porque el backend requiere las cookies de sesión, que solo están disponibles en el contexto del navegador con `credentials: 'include'`.

## Imágenes

Las imágenes remotas se declaran en `next.config.ts` con `remotePatterns`:

```ts
remotePatterns: [
  { hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
  { hostname: 'web-core-storage.s3.us-east-1.amazonaws.com', pathname: '/**' }
]
```

Se usa el componente `<img>` nativo (no `next/image`) en los formularios de carga para simplificar la previsualización de archivos.

## Source maps

Los source maps están deshabilitados en producción (`productionBrowserSourceMaps: false`) para no exponer código fuente.
