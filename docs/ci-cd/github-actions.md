# Workflow de GitHub Actions

**Archivo:** `.github/workflows/ci.yml`

Se ejecuta en cada `push` y `pull_request` contra las ramas `main` y `dev`. Define dos jobs secuenciales.

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
```

## Job 1 — `validate` (Lint, Typecheck & Build)

Corre siempre, no requiere backend desplegado ni secrets.

| Paso | Comando |
|------|---------|
| Instalar dependencias | `npm ci` |
| Lint | `npm run lint` (`continue-on-error: true` — no bloquea el job) |
| Typecheck | `npx tsc --noEmit` |
| Build | `npm run build` |

`NEXT_PUBLIC_BACKEND_CMS_URL` se pasa como placeholder (`http://localhost:3001` si el secret no está definido) porque el build solo verifica que el proyecto compile — no hay runtime real en este job.

> El lint tiene `continue-on-error: true` en CI para no bloquear el pipeline por warnings, pero sí bloquea localmente vía el git hook `pre-commit` (ver [Git Hooks](./git-hooks.md)).

## Job 2 — `e2e` (E2E Tests con Playwright)

Depende de `validate` (`needs: validate`) y **solo corre en pushes directos** a `main`/`dev` (`if: github.event_name == 'push'`), no en pull requests, porque los secrets de backend no están disponibles en PRs de forks.

| Paso | Comando |
|------|---------|
| Instalar dependencias | `npm ci` |
| Instalar Chromium | `npx playwright install chromium --with-deps` |
| Ejecutar tests E2E | `npm run test:e2e` |
| Subir reporte Playwright | `actions/upload-artifact@v4` (siempre, incluso si falla) |

### Secrets requeridos

| Secret | Uso |
|--------|-----|
| `NEXT_PUBLIC_BACKEND_CMS_URL` | URL del backend real contra el que corren los tests E2E |
| `TEST_E2E_USER` | Usuario de prueba para login |
| `TEST_E2E_PASS` | Contraseña del usuario de prueba |

El reporte HTML de Playwright se sube como artifact (`playwright-report/`, retención de 7 días) para poder inspeccionar fallos sin volver a correr los tests.

## Relación con los git hooks locales

Desde que se agregó Husky, ambos jobs tienen su equivalente local que corre **antes** de que el código llegue al remoto — ver [Git Hooks (Husky)](./git-hooks.md). El workflow de CI se mantiene como red de seguridad final (por ejemplo, si alguien hace push con `--no-verify` o desde un entorno sin los hooks instalados).
