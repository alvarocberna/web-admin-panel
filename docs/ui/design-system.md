# Sistema de Diseño

## Tecnología base

**Tailwind CSS 4** — utility-first. Los estilos personalizados se definen en `src/app/globals.css`.

## Paleta de colores

El proyecto usa la paleta **Zinc** de Tailwind como escala de grises base, con colores de acento semánticos:

| Uso | Color Tailwind |
|-----|---------------|
| Fondo principal | `zinc-50`, `white` |
| Bordes y divisores | `zinc-200`, `zinc-300` |
| Texto secundario | `zinc-500`, `zinc-600` |
| Texto principal | `zinc-800`, `zinc-900` |
| Acción primaria | `blue-600`, `blue-700` |
| Éxito | `green-600`, `green-100` |
| Advertencia | `amber-600`, `amber-100` |
| Peligro / Eliminar | `red-600`, `red-100` |
| Pendiente | `yellow-100`, `yellow-800` |
| Aprobado | `green-100`, `green-800` |

## Clases utilitarias globales

Definidas en `src/app/globals.css`:

```css
.btn          /* Base de botón: padding, rounded, transición */
.btn-primary  /* Botón azul principal */
.btn-pill     /* Botón con border-radius completo */
.card         /* Tarjeta con sombra y borde */
```

## Tipografía

**Fuentes:** Geist Sans y Geist Mono (importadas vía `next/font/google` en el root layout).

```
Escala de tamaño Tailwind:
- text-xs    → etiquetas, metadatos
- text-sm    → texto de interfaz, labels
- text-base  → cuerpo de texto
- text-lg    → subtítulos de sección
- text-xl    → títulos de página
- text-2xl+  → headings principales
```

## Espaciado y layout

El layout principal usa un **sidebar fijo** en desktop y un **drawer** en mobile.

- **Sidebar desktop:** ancho fijo ~240px, fijo en el lado izquierdo
- **Contenido principal:** margen izquierdo equivalente al sidebar en `md:` y arriba
- **Mobile:** sidebar oculto, botón hamburguesa muestra drawer por encima del contenido

Espaciado interno de las secciones: `p-4` a `p-6`. Gaps de grids: `gap-4` a `gap-6`.

## Componentes base del sistema

### Inputs con label flotante

El patrón de label flotante se implementa con Tailwind puro:

```tsx
<div className="relative">
  <input
    {...register('campo')}
    className="peer w-full border rounded px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2"
    placeholder=" "
  />
  <label className="absolute left-3 top-2 text-xs text-zinc-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm transition-all">
    Nombre del campo
  </label>
</div>
```

### Cards de contenido

```tsx
<div className="card p-4">
  {/* contenido */}
</div>
```

### Estados de estado (`status`)

Los artículos y testimonios tienen un campo `status` con dos posibles valores:

| Status | Badge |
|--------|-------|
| `pending` | Fondo amarillo, texto amber |
| `approved` | Fondo verde claro, texto verde |

## Iconos

Se usa **FontAwesome** con los paquetes:
- `@fortawesome/fontawesome-svg-core`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/free-regular-svg-icons`
- `@fortawesome/free-brands-svg-icons`
- `@fortawesome/react-fontawesome`

Uso:

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

<FontAwesomeIcon icon={faPlus} className="text-zinc-500" />
```

## Notificaciones

Se usa `react-toastify`. El `ToastProvider` se incluye en el root layout. Las notificaciones aparecen en la esquina superior derecha.

```tsx
toast.success('Operación exitosa')
toast.error('Error al procesar')
```

## Responsive

Los breakpoints usados:

| Prefijo | Ancho mínimo | Uso principal |
|---------|-------------|---------------|
| (base) | 0px | Mobile |
| `md:` | 768px | Tablet / sidebar visible |
| `lg:` | 1024px | Desktop completo |
