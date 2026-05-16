# Estrategia de Renderizado

## Modelo general

Este proyecto usa el **App Router de Next.js 16**. Por defecto, todos los componentes son **Server Components** a menos que incluyan la directiva `'use client'`.

Los datos de lectura (GET) se obtienen en el servidor usando `apiFetchServer`, que lee las cookies de sesión desde los `headers()` de Next.js. Los Client Components quedan reservados para operaciones mutantes y UI interactiva.

## Por tipo de componente

### Server Components (sin directiva)

Hay dos roles distintos:

**`page.tsx`** — inicia el fetch como promesas y las delega a componentes anidados:
- Llama a los servicios de servidor (`*.server.service.ts`) para obtener promesas
- Envuelve los componentes de contenido en `<Suspense>` con un skeleton como fallback
- No hace `await` directamente — pasa las promesas hacia abajo como props

**Componentes de contenido** (`*-content.component.tsx`, `card-*.component.tsx`, etc.) — son async y resuelven los datos:
- Reciben promesas como props y las resuelven con `await`
- Pasan los datos ya resueltos a los Client Components hijos
- Sin directiva `'use client'`

### Client Components (`'use client'`)

Usados exclusivamente para:
- **Formularios con mutaciones** — POST, PUT, DELETE a través de `react-hook-form`
- **Estado interactivo local** — `useState`, `useEffect`, `useRouter`
- Reciben datos ya resueltos como props (nunca promesas)
- Llaman a `router.refresh()` tras una mutación para que el Server Component padre vuelva a fetchear


## Servicios: servidor vs. cliente

Cada dominio tiene dos archivos de servicio:

| Archivo | Contexto | Función de fetch |
|---------|----------|-----------------|
| `*.server.service.ts` | Server Component | `apiFetchServer` (lee cookies desde `headers()`) |
| `*.service.ts` | Client Component | `apiFetch` (cookies vía `credentials: 'include'`) |

Los imports de servicios de servidor se hacen directamente (sin pasar por el barrel `src/features/index.ts`) para evitar que `next/headers` llegue al bundle del cliente.

## Fetch de datos

| Escenario | Método |
|-----------|--------|
| Lectura inicial de una página | Server Component → `*.server.service.ts` → `apiFetchServer` |
| Mutaciones (crear/editar/eliminar) | Client Component → `*.service.ts` → `apiFetch` |
| Archivos e imágenes | Client Component → `apiFetchFormData` con `FormData` |
| Revalidar tras mutación | `router.refresh()` en el Client Component |

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
