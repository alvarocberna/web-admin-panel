# Git Hooks (Husky)

Se usa [Husky](https://typicode.github.io/husky/) para ejecutar localmente, antes de `commit` y `push`, las mismas validaciones que corre CI en [`.github/workflows/ci.yml`](./github-actions.md) — así se detectan errores antes de que lleguen al remoto.

## Instalación

Husky se activa automáticamente al instalar dependencias, vía el script `prepare`:

```json
// package.json
"scripts": {
  "prepare": "husky"
}
```

```bash
npm install   # instala husky y configura git config core.hooksPath=.husky/_
```

No requiere pasos manuales adicionales: cualquiera que clone el repo y corra `npm install` queda con los hooks activos.

## `.husky/pre-commit` — equivalente al Job 1 (`validate`)

```sh
npm run lint
npm run typecheck
```

Corre en cada `git commit`. Si `lint` o `typecheck` fallan, el commit se aborta.

> A diferencia del job `validate` en CI (donde `lint` tiene `continue-on-error: true`), en el hook local un error de lint **sí bloquea** el commit — el objetivo es no dejar avanzar código con errores desde el principio.

Se omite el paso `build` (Next.js) del hook local por ser lento en cada commit; ese paso queda cubierto por el job `validate` en CI tras el push.

## `.husky/pre-push` — equivalente al Job 2 (`e2e`)

```sh
npm run test:e2e
```

Corre en cada `git push`. Si algún test E2E de Playwright falla, el push se aborta.

### Requisitos para que corra localmente

Los tests E2E necesitan un backend real y credenciales de prueba disponibles en el entorno local (ver [Tests E2E](../testing/e2e.md#variables-de-entorno)):

```env
# .env.e2e (no commitear)
TEST_E2E_USER=admin@ejemplo.com
TEST_E2E_PASS=tu_contraseña
```

Además, `NEXT_PUBLIC_BACKEND_URL` debe apuntar a un backend accesible, y la aplicación debe poder levantarse (`npm run dev` o el `webServer` configurado en `playwright.config.ts`).

## Saltar los hooks

Solo en casos excepcionales (por ejemplo, un WIP commit local que no se va a pushear todavía):

```bash
git commit --no-verify   # salta pre-commit
git push --no-verify     # salta pre-push
```

> Evitar `--no-verify` en pushes a `main`/`dev` — el pipeline de CI seguirá corriendo, pero se pierde el feedback rápido local y se puede romper el pipeline remoto.

## Resumen

| Hook | Momento | Comandos | Equivalente en CI |
|------|---------|----------|--------------------|
| `pre-commit` | `git commit` | `npm run lint` + `npm run typecheck` | Job `validate` (sin `build`) |
| `pre-push` | `git push` | `npm run test:e2e` | Job `e2e` |
