# Copilot / AI Agent Instructions for web-admin-panel

Summary
- Next.js (App Router) TypeScript project (Next 16 + React 19). App sources live under `src/app` with domain features in `src/features` and shared components in `src/shared`.
- API calls are centralized in `src/shared/api/client.ts` and rely on `process.env.NEXT_PUBLIC_BACKEND_URL` + `credentials: 'include'` (cookie-based auth).
- Protected routes implemented via `src/middleware.ts` - only authenticated users (with `access_token` cookie) can access routes other than `/` (login).

Key patterns & how to work here

- Services: domain logic lives in `src/features/<domain>/services/*.service.ts` as classes with static methods (e.g. `ArticulosService`, `UsuarioService`). When adding a new domain, follow the same structure: `dtos/`, `entities/`, `services/`, `components/`.
  - Example: `ArticulosService.createArticulo()` builds DTOs and calls `apiFetch('articulo/crear','POST', data)`.

- API client behavior (important): `src/shared/api/client.ts`
  - Use `apiFetch<T>(endpoint, method?, data?, credentials = 'include')` to call the backend.
  - Reads `NEXT_PUBLIC_BACKEND_URL` and sends requests to `${url}/${endpoint}`.
  - Built-in handling:
    - 401 → calls `POST ${url}/auth/refresh` (refresh flow) and retries the original request once; if refresh fails it throws `Error('Sesión expirada')`.
    - Non-ok 4xx/5xx → attempts `res.json()` and throws with `errorData.message` or fallback to HTTP status.
    - 204 No Content → returns `undefined`.
  - Implication: this client is designed for browser/client-side usage where cookies are used for auth (credentials included). Avoid assuming server-side automatic cookie forwarding without explicit handling.

- Protected Routes (middleware): `src/middleware.ts`
  - Intercepts all requests and checks for `access_token` cookie.
  - Public routes: `/` (login page).
  - Protected routes: everything else (`/dashboard`, `/articulos`, `/usuarios`, `/actividad`).
  - Redirects: unauthenticated users to `/`, authenticated users trying to access `/` → `/dashboard`.
  - Use `useAuth()` hook from `@/features` in client components to get current user info.

- DTOs / Entities / Types:
  - DTOs: `src/features/<domain>/dtos/*` (abstract classes defining the request/response shapes).
  - Entities: domain models in `src/features/<domain>/entities/*`.
  - Keep names and structure consistent with existing files (see `articulo.dto.ts` and `articulo.entity.ts`).

- UI & Forms:
  - Client components use `'use client'` and `react-hook-form` (see `src/features/auth/components/form-inicio-sesion.tsx`).
  - Toasts use `react-toastify` for success/error notifications.

- Exports & indexing:
  - `src/features/index.ts` re-exports feature boundaries used elsewhere. When adding new code to a feature, add sensible named exports there so other parts can import from `@/features`.

Developer workflow (how to run / debug)

- Start dev server: `npm run dev` (also supports `yarn/pnpm/bun dev` from README)
- Build: `npm run build`  — run and test production build locally with `npm start`.
- Lint: `npm run lint` (eslint configured via `eslint-config-next`).
- Environment: set `NEXT_PUBLIC_BACKEND_URL` to the backend base URL before starting the dev server.
- Debugging tips: watch network requests in the browser (the app uses `fetch` + cookies). If you see 401, `apiFetch` will attempt `auth/refresh` per the client logic.

Project specifics & constraints

- No test scripts found in `package.json`; there is no test harness. Add tests only following existing patterns (TypeScript + Next.js) and add scripts to `package.json`.
- Tailwind/PostCSS are present (`tailwindcss` & `@tailwindcss/postcss` deps), but there is no `tailwind.config` found—verify local setup when adding styles.
- Language: UI strings and logs are mostly Spanish—keep this consistency in new messages and errors.
- Concurrency: `apiFetch` retries once on 401 to avoid infinite refresh loops (the `isRetry` flag). Preserve this behavior if you change the client.

What to watch for when making changes

- Auth & cookies: Many services depend on authentication stored in cookies. If you change auth flow, update `src/shared/api/client.ts`, `UsuarioService.getUsuario()`, and `src/middleware.ts` consistently.
- Protected routes: When adding new routes, they are protected by default. To make a route public, add it to the `publicRoutes` array in `src/middleware.ts`.
- Server vs Client: `apiFetch` currently assumes requests from a browser context (cookies). For server-side data fetching, either implement a server-aware fetch wrapper or ensure cookies/headers are passed explicitly.
- Adding features: mirror the existing feature structure and add exports to `src/features/index.ts`.

Examples to reference while coding
- API call + refresh: `src/shared/api/client.ts`
- Auth service: `src/features/auth/services/auth.service.ts`
- Protected routes middleware: `src/middleware.ts`
- User authentication hook: `src/features/auth/hooks/useAuth.ts`
- User service (authenticated user lookup): `src/features/usuarios/services/usuario.service.ts`
- Article service building DTOs: `src/features/articulos/services/articulos.service.ts`
- Form usage pattern: `src/features/auth/components/form-inicio-sesion.tsx`
- Logout implementation: `src/shared/components/navbar.tsx`

If anything in these notes is unclear or you need more examples (e.g., how to add a new backend endpoint or how to implement server-side fetching with cookies), tell me which part to expand and I will iterate. ✅
