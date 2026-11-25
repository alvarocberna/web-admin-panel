# web-admin-panel

Panel de administración del sistema CMS, dedicado para que los clientes gestionen el contenido de su sitio (artículos, equipo, servicios, testimonios, usuarios y actividad) y el `SUPERADMIN` gestiona proyectos.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 4, iconos FontAwesome, animaciones GSAP
- **Formularios y UI:** react-hook-form, react-toastify, dnd-kit (reordenar equipo/servicios)
- **Estado global:** Zustand (usuario autenticado)
- **Auth:** cookies HTTP-only emitidas por `web-core` (JWT access + refresh) + token CSRF; protección de rutas en `src/proxy.ts`
- **Testing:** Playwright (e2e contra un backend real)
- **Calidad:** ESLint (`eslint-config-next`), `tsc --noEmit`, Husky

## Requisitos previos

- Node.js **20.x** (la versión del CI) y npm 10+
- [`web-core`](../web-core) corriendo (por defecto en `http://localhost:3001`) con `http://localhost:3000` incluido en su `CORS_ORIGINS`
- Un usuario creado en el backend para iniciar sesión (y otro para los tests e2e)
- Para e2e: Chromium de Playwright (`npx playwright install chromium`)

## Puesta en marcha

```bash
# 1. Levanta antes el backend (ver ../web-core/README.md)

# 2. Variables de entorno 
cat > .env <<'EOF'
NEXT_PUBLIC_BACKEND_CMS_URL=http://localhost:3001
NEXT_PUBLIC_PROYECTO_ID=<uuid-del-proyecto>
EOF

# 3. Dependencias (también instala los hooks de Husky)
npm install

# 4. Servidor de desarrollo
npm run dev
```

- Panel: `http://localhost:3000` (la raíz `/` es el login)
- Plantilla del sitio público: `http://localhost:3000/project` (solo `SUPERADMIN`)

## Variables de entorno

Todas son `NEXT_PUBLIC_*`, así que **se incrustan en el bundle al compilar**: deben existir en tiempo de build y no pueden contener secretos. Detalle en [docs/guides/setup.md](docs/guides/setup.md#variables-de-entorno).

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_CMS_URL` | Sí (por defecto `http://localhost:3001`) | URL base de `web-core`; la usan el cliente API, `proxy.ts`, el rewrite `/api/*` y la CSP |
| `NEXT_PUBLIC_PROYECTO_ID` | Solo para `/project` | UUID del proyecto cuyo contenido público muestra la plantilla de `features/integration` |
| `TEST_E2E_USER` | Solo e2e | Email del usuario de pruebas (en `.env.e2e`) |
| `TEST_E2E_PASS` | Solo e2e | Contraseña del usuario de pruebas (en `.env.e2e`) |

`NODE_ENV` lo gestiona Next.js; no hace falta definirlo.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `:3000` |
| `npm run build` | Build de producción en `.next/` |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos con `tsc --noEmit` |
| `npm run test:e2e` | Todos los tests Playwright (levanta `npm run dev` si no está corriendo) |
| `npm run test:e2e:auth` | Solo la suite de login |
| `npm run test:e2e:admin` | Setup de sesión + suites CRUD (artículos, equipo, servicios, usuarios) |
| `npm run test:e2e:ui` | Playwright en modo UI interactivo |
| `npm run test:e2e:report` | Abre el último reporte HTML |

No hay tests unitarios configurados.

## Arquitectura

```
src/
├── app/
│   ├── page.tsx           # / → login (única ruta pública)
│   ├── (admin)/           # Route group protegido: dashboard, articulos, equipo, servicios,
│   │                      #   testimonios, usuarios, actividad, perfil, superadmin
│   └── project/           # Plantilla del sitio público (SSR, revalidate 300 s)
├── features/<dominio>/    # Un módulo por dominio
│   ├── services/          #   clases con métodos estáticos que llaman a apiFetch()
│   ├── dtos/ entities/    #   formas de request/response y modelos
│   ├── components/        #   componentes cliente ('use client')
│   └── hooks/ store/ types/ interfaces/
├── features/integration/  # Servicios y componentes de la plantilla pública
├── features/index.ts      # Barrel: todo lo exportable se registra aquí
├── shared/
│   ├── api/               # client.ts (navegador) y client-server.ts (Server Components)
│   ├── integration/       # Cliente API de la plantilla pública
│   ├── components/        # UI reutilizable (navbar, inputs, toasts…)
│   └── utils/             # Sanitización de inputs
└── proxy.ts               # "Middleware" de Next 16: sesión, refresh, CSRF y guard de roles
e2e/                       # Tests Playwright (auth/, admin/, global.setup.ts)
docs/                      # Documentación técnica detallada
```

Reglas que no se deducen del código:

- **Toda llamada al backend pasa por `apiFetch()`** (`src/shared/api/client.ts`): añade `credentials: 'include'`, el header `X-CSRF-Token` en mutaciones y reintenta una sola vez tras un 401 con `POST /auth/refresh`. No uses `fetch` directo y conserva el flag `isRetry`.
- **En Server Components** usa `client-server.ts`; las cookies hay que reenviarlas explícitamente.
- **Rutas:** cualquier ruta nueva es privada por defecto. Para hacerla pública, añádela a `publicRoutes` en `src/proxy.ts`. Los permisos por rol en `proxy.ts` son **solo UX**; la autorización real la aplica `web-core`.
- **`features/integration`, `shared/integration` y `app/project`** se copian tal cual a otros proyectos (ver [docs/guides/integration.md](docs/guides/integration.md)): no deben depender del resto del panel.
- **Idioma:** código en inglés y camelCase; textos de interfaz, toasts y logs en español. El vocabulario de dominio del backend (`proyectoId`, `articulo`…) se mantiene.
- **Imágenes remotas:** cualquier dominio nuevo hay que añadirlo a `images.remotePatterns` y a la CSP de `next.config.ts`.

Más detalle en [docs/architecture/overview.md](docs/architecture/overview.md), [docs/architecture/routing.md](docs/architecture/routing.md), [docs/frontend/folder-structure.md](docs/frontend/folder-structure.md) y [docs/frontend/conventions.md](docs/frontend/conventions.md).

## Despliegue y CI

- **Despliegue:** Vercel (detecta Next.js y ejecuta `npm run build`); `NEXT_PUBLIC_BACKEND_CMS_URL` debe apuntar a la API pública de `web-core` y estar definida antes del build. Alternativa con PM2 en servidor propio. Ver [docs/guides/deployment.md](docs/guides/deployment.md).
- **CI:** GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) en push/PR a `main` y `dev`. El job `validate` (lint, typecheck, build) está comentado y solo queda `e2e`, que corre Playwright en pushes usando los secrets `NEXT_PUBLIC_BACKEND_CMS_URL`, `TEST_E2E_USER` y `TEST_E2E_PASS`. En local, Husky ejecuta `npm run test:e2e` en `pre-push`. Ver [docs/ci-cd/github-actions.md](docs/ci-cd/github-actions.md) y [docs/ci-cd/git-hooks.md](docs/ci-cd/git-hooks.md).

## Problemas conocidos

- **El workflow de CI falla al instante o no se ejecuta**: el job `e2e` declara `needs: validate`, pero `validate` está comentado. Descomenta `validate` o elimina el `needs`.
- **`git push` tarda mucho o se rechaza**: el hook `pre-push` ejecuta toda la suite e2e, así que necesita el backend arriba y `.env.e2e` válido. Levanta `web-core` antes de hacer push.
- **Login correcto pero vuelve a `/` o las peticiones dan error de CORS**: el origen del panel no está en `CORS_ORIGINS` de `web-core`, o la URL de `NEXT_PUBLIC_BACKEND_CMS_URL` no coincide con el backend (revisa `http`/`https` y el puerto).
- **Cambié `NEXT_PUBLIC_*` y no se nota**: estas variables se incrustan en el build. Reinicia `npm run dev` o vuelve a ejecutar `npm run build`.
- **`403` en POST/PUT/DELETE**: falta la cookie CSRF que genera `proxy.ts` o el header no coincide. Recarga la página para regenerarla y comprueba que la petición sale por `apiFetch()`.
- **Imagen bloqueada (`next/image` o CSP)**: su host no está en `remotePatterns` ni en `img-src` de `next.config.ts`; añádelo en ambos sitios.
- **Los tests `admin/*` fallan por sesión**: `e2e/.auth/user.json` está caducado o el usuario de `.env.e2e` no existe en el backend. Ejecuta `npm run test:e2e:admin` (vuelve a correr el setup) o revisa las credenciales.
- **El artículo recién creado no aparece en el listado**: es un fallo conocido; hay que recargar manualmente.

## Contribuir

- **Ramas:** `main` (producción) y `dev` (integración). Crea la rama desde `dev`, abre PR hacia `dev` y después de `dev` a `main`.
- **Commits:** `tipo: descripción` en español y en minúsculas, como en el historial. Tipos usados: `feature`, `fix`, `refactor`, `test`, `doc`, `ci`, `chore`.
  ```
  feature: se añade estado global del user para componentes client x medio de Zustand
  fix: error de tipos en la vista de artículo por fechaPublicacion opcional
  ```
- **Antes del PR:** `npm run lint`, `npm run typecheck` y `npm run build` (el CI ya no los valida) y, con el backend arriba, `npm run test:e2e`.
- **Cambios de contrato con `web-core`:**
  1. Los endpoints, DTOs, nombres de cookies (`access_token`, `refresh_token`) y el header CSRF los define el backend; cualquier cambio empieza allí, en su [docs/api/endpoints.md](../web-core/docs/api/endpoints.md).
  2. Actualiza los `dtos/` y `services/` del dominio afectado en el mismo PR que adapta la UI.
  3. Si cambian los endpoints públicos `*/project/*`, revisa también `features/integration` y avisa a los sitios que ya copiaron la plantilla.
  4. Despliega primero el backend y después el panel.

## Deuda técnica

- El job `validate` del CI está desactivado: lint, typecheck y build no se comprueban en remoto.
- Las variables de entorno son `NEXT_PUBLIC_*` (la URL del backend y el `proyectoId` quedan expuestos en el bundle).
- El bucket S3 está fijo en `next.config.ts` en vez de configurarse por variable de entorno.
- No hay tests unitarios de services ni componentes, ni pruebas con entradas atípicas.
- UX pendiente: mensajes específicos de "correo inexistente" y "contraseña incorrecta" y refresco del listado tras crear un artículo.
- `CLAUDE.md` está desactualizado (dice que no hay tests) y no existe `.env.example`.

El detalle está en `docs/deuda-tecnica/deuda-tecnica.md`, que está en `.gitignore` y solo existe en local.
