# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm start         # Start production server (after build)
npm run lint      # Run ESLint
```

Set `NEXT_PUBLIC_BACKEND_CMS_URL` before starting the dev server (default: `http://localhost:3001`).

There is no test harness configured. If adding tests, follow TypeScript + Next.js patterns and add scripts to `package.json`.

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.

```
src/
├── app/             # Next.js App Router pages
├── features/        # Domain feature modules (articulos, auth, usuarios, actividad, proyectos)
├── shared/
│   ├── api/         # Centralized API client (client.ts)
│   └── components/  # Shared UI components (navbar, container, inputs)
└── proxy.ts         # Acts as middleware for CSRF + route protection
```

### Feature Module Structure

Each domain under `src/features/<domain>/` follows:
- `services/` — static method classes calling `apiFetch()`
- `dtos/` — abstract classes for request/response shapes
- `entities/` — domain models
- `components/` — React components (`'use client'`)
- `types/`, `interfaces/`, `hooks/`

All feature exports are indexed in `src/features/index.ts` — add new exports there.

### API Client (`src/shared/api/client.ts`)

`apiFetch<T>(endpoint, method?, data?, credentials?)` is the core API function:
- Sends to `${NEXT_PUBLIC_BACKEND_CMS_URL}/${endpoint}` with `credentials: 'include'`
- **401 → auto-refresh**: calls `POST /auth/refresh` and retries once (guarded by `isRetry` flag — preserve this)
- **Refresh fail**: throws `Error('Sesión expirada')`
- **204**: returns `undefined`
- Injects `X-CSRF-Token` header automatically for mutating methods (POST, PUT, PATCH, DELETE)

This client is browser-only (cookie-based). For server-side fetching, cookies/headers must be passed explicitly.

### Authentication & Route Protection

**Middleware** (`src/proxy.ts`):
- Public route: `/` (login)
- All other routes are protected — check for `access_token` cookie
- Generates CSRF token via `crypto.randomUUID()` stored as non-httpOnly cookie (readable by JS)
- To add a public route, update the `publicRoutes` array in `src/proxy.ts`

**Auth flow**: credentials → backend sets HttpOnly cookies (`access_token`, `refresh_token`) → middleware gates routes → `apiFetch` handles 401 refresh automatically.

**`useAuth()` hook** (from `@/features`): fetches current user via `GET /usuario/authenticated`, redirects to login on session expiry.

### UI Patterns

- Client components: `'use client'` directive + `react-hook-form`
- Notifications: `react-toastify` for success/error toasts
- Icons: FontAwesome
- UI strings and log messages are in **Spanish** — keep this consistent in new code

### Key Backend Endpoints

- `POST /auth/login` / `POST /auth/logout` / `POST /auth/refresh`
- `GET /usuario/authenticated`
- `GET /articulo/ver-todos`, `GET /articulo/ver/{id}`
- `POST /articulo/crear`, `PUT /articulo/editar/{id}`, `DELETE /articulo/delete/{id}`

## Key Files

| Purpose | Path |
|---|---|
| API client + refresh logic | `src/shared/api/client.ts` |
| Middleware / CSRF / route protection | `src/proxy.ts` |
| Auth service | `src/features/auth/services/auth.service.ts` |
| Auth hook | `src/features/auth/hooks/useAuth.ts` |
| Article service | `src/features/articulos/services/articulos.service.ts` |
| User service | `src/features/usuarios/services/usuario.service.ts` |
| Feature barrel exports | `src/features/index.ts` |
| Next.js config (rewrites, headers) | `next.config.ts` |
