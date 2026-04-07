# Catálogo de Componentes

Todos los componentes compartidos están en `src/shared/components/` y se exportan desde `src/shared/index.ts`.

---

## Layout

### `ContenedorAdmin`

**Archivo:** `src/shared/components/container.tsx`

Wrapper principal de todas las páginas protegidas. Incluye el `NavbarAdmin` y renderiza el contenido en el slot `children`.

```tsx
import { ContenedorAdmin } from '@/shared'

export default function Layout({ children }) {
  return <ContenedorAdmin>{children}</ContenedorAdmin>
}
```

---

### `NavbarAdmin`

**Archivo:** `src/shared/components/navbar.tsx`

Sidebar de navegación con los siguientes comportamientos:
- **Desktop:** sidebar fijo a la izquierda
- **Mobile:** drawer que se abre con el botón hamburguesa

**Items de navegación** (visibilidad por rol):

| Item | Rol mínimo |
|------|-----------|
| Dashboard | USER |
| Artículos | USER |
| Perfil | USER |
| Equipo | ADMIN |
| Servicios | ADMIN |
| Testimonios | ADMIN |
| Usuarios | ADMIN |
| Historial | ADMIN |
| Project | SUPERADMIN |
| Superadmin | SUPERADMIN |

Incluye botón de logout que llama a `AuthService.logout()` y redirige a `/`.

---

## Secciones de contenido

Los componentes de sección se usan para estructurar visualmente bloques de contenido dentro de una página.

### `TitleSec`

**Archivo:** `src/shared/components/title-sec.tsx`

Título principal de una sección de página.

```tsx
<TitleSec>Gestión de Artículos</TitleSec>
```

---

### `ContSubSec`

**Archivo:** `src/shared/components/cont-sub-sec.tsx`

Contenedor de una subsección. Envuelve `HeadSubSec` + `BodySubSec` + `FooterSubSec`.

---

### `HeadSubSec`

**Archivo:** `src/shared/components/head-sub-sec.tsx`

Encabezado de una subsección (título + acciones opcionales).

---

### `BodySubSec`

**Archivo:** `src/shared/components/body-sub-sec.tsx`

Cuerpo de una subsección. Contiene el contenido principal.

---

### `FooterSubSec`

**Archivo:** `src/shared/components/footer-sub-sec.tsx`

Pie de una subsección. Contiene botones de acción (guardar, cancelar).

---

### `TitleSubSec`

**Archivo:** `src/shared/components/title-sub-sec.tsx`

Título interno de una subsección.

---

## Inputs de formulario

### `Input`

**Archivo:** `src/shared/components/input.tsx`

Input de texto con label flotante.

```tsx
<Input
  label="Nombre"
  {...register('nombre', { required: 'Campo requerido' })}
  error={errors.nombre?.message}
/>
```

**Props:**
- `label` — texto del label
- `error` — mensaje de error (opcional)
- Pasa el resto de props a `<input>` nativo (register de react-hook-form)

---

### `TextAreaArt`

**Archivo:** `src/shared/components/textarea.tsx`

Textarea con label flotante para contenido largo (descripciones, contenido de secciones de artículos).

```tsx
<TextAreaArt
  label="Contenido"
  rows={6}
  {...register('contenido')}
/>
```

---

### `InputFile`

**Archivo:** `src/shared/components/input-file.tsx`

Input de tipo file con validación de MIME y tamaño.

```tsx
<InputFile
  label="Imagen"
  accept="image/*"
  {...register('imagen')}
/>
```

---

## Notificaciones

### `ToastProvider`

**Archivo:** `src/shared/components/toast-provider.tsx`

Configura el contenedor de `react-toastify`. Se incluye una sola vez en `src/app/layout.tsx`.

No se usa directamente en páginas — solo en el root layout.

---

## API Client

### `apiFetch<T>`

**Archivo:** `src/shared/api/client.ts`

```ts
apiFetch<T>(
  endpoint: string,
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: unknown,
  credentials?: RequestCredentials,
  isRetry?: boolean
): Promise<T | undefined>
```

- `endpoint` — ruta sin la barra inicial (ej: `'equipo/ver-todo'`)
- `method` — default `'GET'`
- `data` — body de la petición (se serializa como JSON)
- `credentials` — default `'include'`
- `isRetry` — interno, evita bucle infinito de refresh

---

### `apiFetchFormData<T>`

**Archivo:** `src/shared/api/client.ts`

```ts
apiFetchFormData<T>(
  endpoint: string,
  formData: FormData,
  method?: 'POST' | 'PUT' | 'PATCH',
  credentials?: RequestCredentials,
  isRetry?: boolean
): Promise<T>
```

Igual que `apiFetch` pero sin serializar el body, enviando el `FormData` directamente. No establece `Content-Type` (el navegador lo hace automáticamente con el boundary de multipart).
