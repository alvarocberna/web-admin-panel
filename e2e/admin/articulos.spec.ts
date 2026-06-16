import { test, expect } from '@playwright/test';

test.describe('CRUD Artículos', () => {

  const ctx = { titulo: '', tituloActualizado: '' };

  test.beforeAll(() => {
    ctx.titulo = `E2E Artículo ${Date.now()}`;
    ctx.tituloActualizado = `${ctx.titulo} — Editado`;
  });

  test('navegar a la página de artículos', async ({ page }) => {
    await page.goto('/articulos');
    await expect(page.getByRole('heading', { name: 'Artículos', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Nuevo artículo/i })).toBeVisible();
  });

  test('crear artículo', async ({ page }) => {
    await page.goto('/articulos/crear');

    await expect(page.getByRole('heading', { name: 'Nuevo Articulo' })).toBeVisible();

    await page.getByLabel('Título', { exact: true }).fill(ctx.titulo);
    await page.getByLabel('Subtítulo', { exact: true }).fill('Subtítulo generado por test E2E');

    await page.getByRole('button', { name: 'Guardar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Articulo creado', { timeout: 30_000 });
    await page.waitForURL('/articulos', { timeout: 20_000 });
    await expect(page).toHaveURL('/articulos');
  });

  test('ver artículo creado en la lista', async ({ page }) => {
    await page.goto('/articulos');

    const card = page.locator('.card').filter({ hasText: ctx.titulo });
    await expect(card).toBeVisible({ timeout: 20_000 });
    await expect(card.getByText(ctx.titulo)).toBeVisible();
  });

  test('ver detalle del artículo', async ({ page }) => {
    await page.goto('/articulos');

    const card = page.locator('.card').filter({ hasText: ctx.titulo });
    await card.getByTitle('Ver artículo').click();

    await page.waitForURL(/\/articulos\/.*\/ver/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: ctx.titulo, exact: true })).toBeVisible({ timeout: 30_000 });
  });

  test('editar artículo', async ({ page }) => {
    await page.goto('/articulos');

    const card = page.locator('.card').filter({ hasText: ctx.titulo });
    await card.getByTitle('Editar artículo').click();

    await page.waitForURL(/\/articulos\/.*\/modificar/, { timeout: 30_000 });

    const titleInput = page.getByLabel('Título', {exact: true});
    await expect(titleInput).toHaveValue(ctx.titulo, { timeout: 30_000});

    await titleInput.clear();
    await titleInput.fill(ctx.tituloActualizado);

    await page.getByRole('button', { name: 'Guardar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Articulo actualizado', { timeout: 60_000 });
    await page.waitForURL('/articulos', { timeout: 30_000 });

    const updatedCard = page.locator('.card').filter({ hasText: ctx.tituloActualizado });
    await expect(updatedCard).toBeVisible({ timeout: 30_000 });
  });

  test('eliminar artículo', async ({ page }) => {
    await page.goto('/articulos');

    const card = page.locator('.card').filter({ hasText: ctx.tituloActualizado });
    await card.getByTitle('Eliminar artículo').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Eliminar artículo' });
    await expect(modal).toBeVisible({ timeout: 30_000 });

    await modal.getByRole('button', { name: 'Eliminar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('eliminado', { timeout: 60_000 });

    await expect(page.locator('.card').filter({ hasText: ctx.tituloActualizado })).not.toBeVisible({ timeout: 30_000 });
  });
});
