# Guía de Desarrollo

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Build de producción
npm start        # Servidor de producción (requiere build previo)
npm run lint     # Linter ESLint
```

## Agregar una nueva página

1. Crear el directorio en `src/app/<ruta>/`
2. Agregar `page.tsx` (Server Component — solo importa el componente cliente)
3. Si necesita navbar/sidebar, agregar `layout.tsx` que use `ContenedorAdmin`
4. Si la ruta debe ser protegida, no hace falta nada extra — el middleware protege todo salvo `/`
5. Si la ruta debe ser pública, agregarla a `publicRoutes` en `src/proxy.ts`

**Ejemplo mínimo:**

```tsx
// src/app/mi-seccion/layout.tsx
import { ContenedorAdmin } from '@/shared'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ContenedorAdmin>{children}</ContenedorAdmin>
}

// src/app/mi-seccion/page.tsx
import { MiSeccionClient } from '@/features'

export default function MiSeccionPage() {
  return <MiSeccionClient />
}
```

## Agregar un nuevo módulo de dominio

1. Crear `src/features/<dominio>/` con la estructura estándar:
   ```
   <dominio>/
   ├── services/<dominio>.service.ts
   ├── entities/<dominio>.entity.ts
   ├── dtos/<dominio>.dto.ts
   └── components/<componente>.tsx
   ```
2. Exportar desde `src/features/index.ts`

## Agregar un endpoint al servicio

```ts
// En el archivo de servicio correspondiente
static async miNuevoMetodo(id: string): Promise<MiEntidad> {
  return apiFetch<MiEntidad>(`mi-dominio/ver/${id}`)
}
```

Para peticiones con body:

```ts
static async crear(data: MiDto): Promise<MiEntidad> {
  return apiFetch<MiEntidad>('mi-dominio/crear', 'POST', data)
}
```

Para subida de archivos:

```ts
static async crearConImagen(data: MiFormInput): Promise<MiEntidad> {
  const formData = new FormData()
  formData.append('nombre', data.nombre)
  if (data.imagen?.[0]) formData.append('imagen', data.imagen[0])
  return apiFetchFormData<MiEntidad>('mi-dominio/crear', formData, 'POST')
}
```

## Control de roles en la UI

Para ocultar elementos según el rol del usuario:

```tsx
const { user } = useAuth()

if (user?.rol === 'SUPERADMIN') {
  // mostrar opciones de superadmin
}
```

## Notificaciones

```tsx
import { toast } from 'react-toastify'

toast.success('Operación exitosa')
toast.error('Error al procesar la solicitud')
```

## Estilos

Se usa Tailwind CSS 4. Las clases utilitarias personalizadas (`.btn`, `.card`, `.btn-primary`) están definidas en `src/app/globals.css`.

## Linting

```bash
npm run lint
```

La configuración de ESLint es la estándar de Next.js. Resuelve todos los warnings antes de hacer commit a `main`.

## Git Flow

- Rama principal: `main`
- Rama de desarrollo: `dev`
- Hacer PRs desde ramas de feature hacia `dev`, luego de `dev` a `main`

## Depuración

- Los errores de `apiFetch` se lanzan como `Error` con el mensaje del backend
- Revisar la pestaña Network del navegador para ver requests y respuestas
- El middleware se ejecuta en el Edge Runtime — sus logs aparecen en la terminal del servidor, no en el navegador
