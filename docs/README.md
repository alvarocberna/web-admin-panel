# Web Admin Panel — Documentación

Panel de administración web construido con Next.js 16, React 19 y TypeScript. Permite gestionar contenido, usuarios y proyectos mediante una interfaz basada en roles.

## Índice

### Arquitectura
- [Visión general](./architecture/overview.md) — Stack, módulos, flujo de datos
- [Renderizado](./architecture/rendering.md) — SSR vs CSR, estrategias por ruta
- [Enrutamiento](./architecture/routing.md) — App Router, rutas protegidas, proxy
- [authStore](./architecture/auth-store.md) — Estado global de autenticación (Zustand)

### Frontend
- [Estructura de carpetas](./frontend/folder-structure.md) — Árbol de directorios y convenciones
- [Convenciones](./frontend/conventions.md) — Patrones de código, nomenclatura, estilos

### Guías
- [Instalación](./guides/setup.md) — Requisitos y configuración inicial
- [Desarrollo](./guides/development.md) — Flujo de trabajo local
- [Despliegue](./guides/deployment.md) — Build y puesta en producción

### UI
- [Sistema de diseño](./ui/design-system.md) — Colores, tipografía, utilitarios CSS
- [Componentes](./ui/components.md) — Catálogo de componentes compartidos

### Testing
- [Tests E2E](./testing/e2e.md) — Playwright: configuración, suites, patrones y ejecución

### CI/CD
- [Workflow de GitHub Actions](./ci-cd/github-actions.md) — Jobs `validate` y `e2e`, secrets, artifacts
- [Git Hooks (Husky)](./ci-cd/git-hooks.md) — `pre-commit` y `pre-push`, equivalentes locales de los jobs de CI

## Stack rápido

| Capa             | Tecnología                  |
|------------------|-----------------------------|
| Framework        | Next.js 16.1.1 (App Router) |
| UI               | React 19 + Tailwind CSS 4   |
| Lenguaje         | TypeScript 5                |
| Formularios      | React Hook Form 7           |
| Notificaciones   | React Toastify 11           |
| Iconos           | FontAwesome 6               |
| Animaciones      | GSAP 3                      |
| Drop & Drag      | DND Kit                     |
| Estado global    | Zustand 5                   |
