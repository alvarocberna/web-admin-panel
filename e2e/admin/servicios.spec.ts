import { test, expect } from '@playwright/test';

test.describe('CRUD Servicios', () => {

  const ctx = { nombre: '', nombreActualizado: '' };

  test.beforeAll(() => {
    const ts = Date.now();
    ctx.nombre = `E2E Servicio ${ts}`;
    ctx.nombreActualizado = `${ctx.nombre} Editado`;
  });

  test('navegar a la página de servicios', async ({ page }) => {
    await page.goto('/servicios');
    await expect(page.getByRole('heading', { name: 'Servicios', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Nuevo servicio/i })).toBeVisible();
  });

  test('crear nuevo servicio', async ({ page }) => {
    await page.goto('/servicios');

    await page.getByRole('button', { name: /Nuevo servicio/i }).click();

    const modal = page.locator('.fixed').filter({ hasText: 'Nuevo servicio' });
    await expect(modal).toBeVisible();

    await modal.getByLabel('Nombre del servicio', { exact: true }).fill(ctx.nombre);

    await modal.getByRole('button', { name: 'Crear servicio' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Servicio creado correctamente', { timeout: 30_000 });
    await expect(modal).not.toBeVisible();
  });

  test('ver card de servicio creado', async ({ page }) => {
    await page.goto('/servicios');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await expect(card).toBeVisible({ timeout: 20_000 });
    await expect(card.getByText(ctx.nombre, { exact: true })).toBeVisible();
  });

  test('ver detalle del servicio', async ({ page }) => {
    await page.goto('/servicios');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await card.getByTitle('Editar servicio').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Editar servicio' });
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel('Nombre del servicio', { exact: true })).toHaveValue(ctx.nombre);

    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('editar servicio', async ({ page }) => {
    await page.goto('/servicios');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await card.getByTitle('Editar servicio').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Editar servicio' });
    await expect(modal).toBeVisible();

    const nombreInput = modal.getByLabel('Nombre del servicio', { exact: true });
    await nombreInput.clear();
    await nombreInput.fill(ctx.nombreActualizado);

    await modal.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Servicio actualizado correctamente', { timeout: 30_000 });

    const updatedCard = page.locator('.card').filter({ hasText: ctx.nombreActualizado });
    await expect(updatedCard).toBeVisible({ timeout: 20_000 });
  });

  test('eliminar servicio', async ({ page }) => {
    await page.goto('/servicios');

    const card = page.locator('.card').filter({ hasText: ctx.nombreActualizado });
    await card.getByTitle('Eliminar servicio').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Eliminar servicio' });
    await expect(modal).toBeVisible({ timeout: 10_000 });

    await modal.getByRole('button', { name: 'Eliminar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Servicio eliminado correctamente', { timeout: 30_000 });

    await expect(page.locator('.card').filter({ hasText: ctx.nombreActualizado })).not.toBeVisible({ timeout: 20_000 });
  });
});
