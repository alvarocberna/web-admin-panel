# Tests E2E

Tests de extremo a extremo con [Playwright](https://playwright.dev/). Verifican los flujos críticos del panel de administración ejecutándose contra la aplicación real en `http://localhost:3000`.

## Estructura

```
e2e/
├── global.setup.ts        # Autenticación compartida (guarda storageState)
├── .auth/
│   └── user.json          # Sesión persistida entre suites admin (generado)
├── auth/
│   └── login.spec.ts      # Flujos de autenticación
└── admin/
    ├── articulos.spec.ts  # CRUD Artículos
    ├── equipo.spec.ts     # CRUD Equipo
    ├── servicios.spec.ts  # CRUD Servicios
    └── usuarios.spec.ts   # CRUD Usuarios
```

## Configuración

**Archivo:** `playwright.config.ts`

| Parámetro          | Valor                           |
|--------------------|---------------------------------|
| `testDir`          | `./e2e`                         |
| `fullyParallel`    | `false` (tests secuenciales)    |
| `timeout`          | 90 000 ms por test              |
| `baseURL`          | `http://localhost:3000`         |
| `trace`            | `on-first-retry`                |
| `reporter`         | HTML (nunca abre automáticamente) |
| `retries` (CI)     | 1                               |

### Proyectos de Playwright

| Proyecto | Archivos que ejecuta             | Navegador       | Depende de |
|----------|----------------------------------|-----------------|------------|
| `setup`  | `global.setup.ts`                | Desktop Chrome  | —          |
| `auth`   | `auth/*.spec.ts`                 | Desktop Chrome  | —          |
| `admin`  | `admin/*.spec.ts`                | Desktop Chrome  | `setup`    |

Las suites del grupo `admin` reutilizan la sesión guardada por `setup` (vía `storageState`), por lo que no necesitan hacer login en cada archivo.

## Variables de entorno

Crear el archivo `.env.e2e` en la raíz del proyecto (no commitear):

```env
TEST_E2E_USER=admin@ejemplo.com
TEST_E2E_PASS=tu_contraseña
```

Estas credenciales se usan tanto en `global.setup.ts` como en `login.spec.ts`.

## Ejecución

```bash
# Ejecutar todos los tests
npx playwright test

# Solo una suite
npx playwright test e2e/admin/articulos.spec.ts

# Con interfaz gráfica (UI mode)
npx playwright test --ui

# Ver reporte HTML tras la ejecución
npx playwright show-report
```

> La aplicación debe estar corriendo (`npm run dev`) o configurar `webServer` en `playwright.config.ts` para que la levante automáticamente (ya está configurado para reutilizar el servidor si existe).

---

## Setup global (`global.setup.ts`)

Ejecuta **una sola vez** antes de todas las suites del grupo `admin`. Realiza el login con las credenciales de entorno y persiste la sesión del navegador en `e2e/.auth/user.json`.

```
/ → clic #btn-login → rellena email/contraseña → clic "Entrar" → espera /dashboard → guarda storageState
```

---

## Suite: Auth — `auth/login.spec.ts`

Verifica los flujos de autenticación sin sesión previa.

**Precondición (`beforeEach`):** navega a `/` y hace clic en `#btn-login` para abrir el formulario.

| Test | Descripción | Resultado esperado |
|------|-------------|-------------------|
| `muestra el formulario de login` | Comprueba que los campos Email, Contraseña y el botón "Entrar" son visibles | Todos los elementos visibles |
| `login exitoso redirige al dashboard` | Rellena credenciales válidas (`TEST_E2E_USER` / `TEST_E2E_PASS`) y envía | Redirección a `/dashboard` |
| `credenciales incorrectas muestran toast de error` | Intenta login con credenciales inválidas | Toast de error visible; URL permanece en `/` |
| `campos vacíos muestran mensaje de validación` | Envía el formulario sin rellenar campos | Mensaje "Campo requerido" visible |
| `ruta protegida sin sesión redirige al login` | Navega directamente a `/dashboard` sin sesión | Redirección a `/` |

---

## Suite: CRUD Artículos — `admin/articulos.spec.ts`

Flujo completo de gestión de artículos. Los tests comparten un contexto (`ctx`) con `titulo` y `tituloActualizado`, generados con timestamp en `beforeAll`.

| Test | Ruta de entrada | Acción | Resultado esperado |
|------|----------------|--------|--------------------|
| `navegar a la página de artículos` | `/articulos` | Sólo navegación | Heading "Artículos" y botón "Nuevo artículo" visibles |
| `crear artículo` | `/articulos/crear` | Rellena Título + Subtítulo → "Guardar" | Toast "Articulo creado"; redirección a `/articulos` |
| `ver artículo creado en la lista` | `/articulos` | Busca la card por título | Card con el título creado visible |
| `ver detalle del artículo` | `/articulos` | Clic en "Ver artículo" de la card | URL cambia a `/articulos/{id}/ver`; heading con el título visible |
| `editar artículo` | `/articulos` | Clic en "Editar artículo" → modifica título → "Guardar" | Toast "Articulo actualizado"; card actualizada visible |
| `eliminar artículo` | `/articulos` | Clic en "Eliminar artículo" → modal → "Eliminar" | Toast con "eliminado"; card desaparece |

**Localizadores clave:**
- Cards: `.card` filtrado por texto del título
- Formulario de creación: página dedicada `/articulos/crear`
- Formulario de edición: página dedicada `/articulos/{id}/modificar`
- Modal de confirmación de eliminación: `.fixed` con texto "Eliminar artículo"

---

## Suite: CRUD Equipo — `admin/equipo.spec.ts`

Flujo completo de gestión de empleados. El contexto compartido incluye `nombre`, `apellido`, `profesion` y `nombreActualizado`, generados con timestamp en `beforeAll`.

| Test | Acción | Resultado esperado |
|------|--------|--------------------|
| `navegar a la página de equipo` | Navega a `/equipo` | Heading "Equipo" y botón "Nuevo empleado" visibles |
| `crear nuevo empleado` | Abre modal → rellena Nombre, Apellido, Profesión → "Crear empleado" | Toast "Empleado creado correctamente"; modal se cierra |
| `ver card de empleado creado` | Busca card con `nombre` | Card con nombre completo y profesión visible |
| `ver detalle del empleado` | Clic en "Editar empleado" → verifica valores → "Cancelar" | Modal con datos correctos; se cierra al cancelar |
| `editar empleado` | Clic en "Editar empleado" → cambia nombre → "Guardar cambios" | Toast "Empleado actualizado correctamente"; card actualizada |
| `eliminar empleado` | Clic en "Eliminar empleado" → modal → "Eliminar" | Toast "Empleado eliminado correctamente"; card desaparece |

**Localizadores clave:**
- Cards: `.card` filtrado por nombre del empleado
- Modal de creación/edición: `.fixed` con texto "Nuevo empleado" / "Editar empleado"
- Botón editar en card: `getByTitle('Editar empleado')`
- Botón eliminar en card: `getByTitle('Eliminar empleado')`

---

## Suite: CRUD Servicios — `admin/servicios.spec.ts`

Flujo completo de gestión de servicios. El contexto comparte `nombre` y `nombreActualizado` generados con timestamp en `beforeAll`.

| Test | Acción | Resultado esperado |
|------|--------|--------------------|
| `navegar a la página de servicios` | Navega a `/servicios` | Heading "Servicios" y botón "Nuevo servicio" visibles |
| `crear nuevo servicio` | Abre modal → rellena "Nombre del servicio" → "Crear servicio" | Toast "Servicio creado correctamente"; modal se cierra |
| `ver card de servicio creado` | Busca card con `nombre` | Card con el nombre exacto visible |
| `ver detalle del servicio` | Clic en "Editar servicio" → verifica nombre → "Cancelar" | Modal con el nombre correcto; se cierra al cancelar |
| `editar servicio` | Clic en "Editar servicio" → cambia nombre → "Guardar cambios" | Toast "Servicio actualizado correctamente"; card actualizada |
| `eliminar servicio` | Clic en "Eliminar servicio" → modal → "Eliminar" | Toast "Servicio eliminado correctamente"; card desaparece |

**Localizadores clave:**
- Cards: `.card` filtrado por nombre del servicio
- Modal de creación/edición: `.fixed` con texto "Nuevo servicio" / "Editar servicio"
- Botón editar en card: `getByTitle('Editar servicio')`
- Botón eliminar en card: `getByTitle('Eliminar servicio')`

---

## Suite: CRUD Usuarios — `admin/usuarios.spec.ts`

Flujo completo de gestión de usuarios con rol `USER`. El contexto comparte `nombre`, `apellido`, `email`, `password` y `nombreActualizado`, generados con timestamp en `beforeAll`.

> A diferencia de otras suites, los usuarios se muestran en una **tabla** (`<tr>`) en lugar de cards.

| Test | Acción | Resultado esperado |
|------|--------|--------------------|
| `crear usuario con rol USER` | Navega a `/usuarios` → abre modal → rellena Nombre, Apellido, Email, Contraseña, Rol=USER → "Crear usuario" | Toast "Usuario creado correctamente"; fila con el email y rol USER visible |
| `editar usuario con rol USER` | Busca fila por email → clic en "Editar usuario" → verifica datos → cambia nombre → "Guardar cambios" | Toast "Usuario actualizado correctamente"; fila actualizada con nuevo nombre |
| `eliminar usuario con rol USER` | Busca fila por email → clic en "Eliminar usuario" → modal → "Eliminar" | Toast "Usuario eliminado correctamente"; fila desaparece |

**Localizadores clave:**
- Filas: `tr` filtrado por email del usuario
- Modal de creación/edición: `.fixed` con texto "Nuevo usuario" / "Editar usuario"
- Botón editar en fila: `getByTitle('Editar usuario')`
- Botón eliminar en fila: `getByTitle('Eliminar usuario')`
- Selector de rol: `getByLabel('Rol', { exact: true }).selectOption('USER')`

---

## Patrones y convenciones

### Datos de prueba con timestamp

Todas las suites CRUD generan datos únicos en `beforeAll` usando `Date.now()`:

```ts
const ctx = { nombre: '', nombreActualizado: '' };

test.beforeAll(() => {
  const ts = Date.now();
  ctx.nombre = `E2E Servicio ${ts}`;
  ctx.nombreActualizado = `${ctx.nombre} Editado`;
});
```

Esto garantiza que los tests no colisionen entre ejecuciones simultáneas y que los datos creados sean identificables.

### Orden de ejecución

Los tests dentro de cada suite son **dependientes entre sí** (crear → leer → editar → eliminar). La configuración `fullyParallel: false` mantiene el orden secuencial. No reordenar los tests dentro de un archivo.

### Timeouts por operación

| Tipo de operación                  | Timeout usado |
|------------------------------------|---------------|
| Toast de confirmación              | 30 000 ms     |
| Aparición/desaparición de elementos| 20 000 ms     |
| Modal de confirmación de eliminación | 10 000 ms   |
| Redirección de URL                 | 20–30 000 ms  |
| Global (por test)                  | 90 000 ms     |

### Localización de toasts

Los toasts de `react-toastify` se localizan con:

```ts
page.locator('.Toastify__toast')           // cualquier toast
page.locator('.Toastify__toast--error')    // toast de error
```

### Autenticación en suites admin

Las suites del grupo `admin` no realizan login explícito. Playwright carga el `storageState` guardado por `global.setup.ts` antes de cada test, reproduciendo la sesión autenticada.
