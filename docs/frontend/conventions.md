# Convenciones de Código

## Idioma

Todos los nombres de components, dtos, entities, services y métodos están en ingles, pero incluyen ciertas palabras en español pertenecientes a los nombres de las entidades de las bases de datos. Ejemplo: La base de datos tiene la entidad 'articulos' por lo que los métodos para llamar articulos se llamarán getArticulos o getArticulosById.

## Componentes React

### Server Components (Pages)

Los `page.tsx` son Server Components: no tienen `'use client'`, pueden importar servicios server-side directamente y se ejecutan en el servidor.

El patrón estándar es iniciar los fetches como `Promise` sin `await` y pasarlos como prop a los componentes hijos envueltos en `<Suspense>`:

Los servicios server-side viven en `services/*.server.service.ts` y usan `apiFetchServer` (que reenvía las cookies del request actual vía `next/headers`). **No** se importan desde el barrel `@/features` para evitar que `next/headers` llegue al bundle cliente — se importan con ruta directa.

### Client Components

Todo componente que use estado, efectos o eventos debe tener la directiva en la primera línea:

```tsx
'use client'
```

Los layouts no necesitan la directiva.

## Servicios

Los servicios son **clases con métodos estáticos** que encapsulan las llamadas al API:


No se instancian — siempre se usan como `EquipoService.getEquipo()`.

## DTOs

Los DTOs son **clases abstractas** que definen la forma de los datos de request/response:

```ts
export abstract class CreateEquipoDto {
  proyecto_id!: string
}

export abstract class UpdateEquipoDto {
  proyecto_id?: string
}
```

## Entidades

Las entidades son **clases con constructor** que representan los modelos del dominio:

```ts
export class EmpleadoEntity {
  constructor(
    public id: string,
    public nombre_primero: string,
    public apellido_paterno: string,
    public profesion: string,
    public orden: number,
    public activo: boolean,
    public img_url: string,
    public equipo_id: string,
  ) {}
}
```

## Formularios

Se usa **React Hook Form** con validación inline:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormType>()

const onSubmit = async (data: FormType) => {
  try {
    await ServicioService.createServicio(data)
    toast.success('Servicio creado correctamente')
  } catch {
    toast.error('Error al crear el servicio')
  }
}
```

Los errores de validación se muestran bajo el campo con texto pequeño en rojo.

### Sanitización de inputs

Antes de enviar datos al backend, los valores de los formularios se sanitizan con las utilidades de `src/shared/utils/sanitize.ts`:

| Función | Comportamiento |
|---------|---------------|
| `stripTags(value)` | Elimina etiquetas HTML (`<...>`) y aplica `trim()`. Usar en campos de texto libre donde se quiere prevenir inyección de HTML. |
| `trimOnly(value)` | Solo aplica `trim()`. Usar en campos donde el whitespace extra no es válido pero no hay riesgo de HTML. |

Ejemplo de uso en un `onSubmit`:

```ts
import { stripTags, trimOnly } from '@/shared/utils/sanitize'

const onSubmit = async (data: FormType) => {
  const payload = {
    nombre: trimOnly(data.nombre),
    descripcion: stripTags(data.descripcion),
  }
  await ServicioService.createServicio(payload)
}
```

## Manejo de errores

- Errores de API → `toast.error('Mensaje en español')`
- Éxito → `toast.success('Mensaje en español')`
- Nunca se lanza un error sin capturarlo en el componente

## Importaciones

Se usa el alias `@/` para importar desde `src/`:

```ts
import { EquipoService } from '@/features'
import { ContenedorAdmin } from '@/shared'
```

Todos los módulos de dominio se importan desde el barrel `@/features`, nunca con rutas internas directas.

## Imágenes y archivos

- Validación en cliente: MIME type `image/*` y tamaño máximo 5MB
- Se envían como `FormData` con `apiFetchFormData()`
- Las secciones sin imagen nueva usan un `File` vacío como placeholder para preservar el orden

## Slugs

Los slugs de artículos se generan en el servicio:

```ts
const slug = titulo
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, '-')
```

## Roles

Los roles disponibles son: `USER`, `ADMIN`, `SUPERADMIN`.

La visibilidad de elementos de la UI se controla leyendo el campo `rol` del usuario autenticado. La autorización real la aplica el backend.

## Notificaciones (Toasts)

Se usa `react-toastify` con el `ToastProvider` en el root layout. Siempre se llama a `toast.success()` o `toast.error()` en los handlers de formularios.

## Exports

Cada módulo de feature tiene su propio `index.ts` y se re-exporta en `src/features/index.ts`. No se importa desde rutas internas de un módulo ajeno.
