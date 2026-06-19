import { test, expect } from '@playwright/test';

test.describe('CRUD Equipo', () => {

  const ctx = { nombre: '', apellido: '', profesion: '', nombreActualizado: '' };

  test.beforeAll(() => {
    const ts = Date.now();
    ctx.nombre = `E2E${ts}`;
    ctx.apellido = `Apellido${ts}`;
    ctx.profesion = 'Ingeniero E2E';
    ctx.nombreActualizado = `${ctx.nombre}Editado`;
  });

  test('navegar a la página de equipo', async ({ page }) => {
    await page.goto('/equipo');
    await expect(page.getByRole('heading', { name: 'Equipo', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Nuevo empleado/i })).toBeVisible();
  });

  test('crear nuevo empleado', async ({ page }) => {
    await page.goto('/equipo');

    await page.getByRole('button', { name: /Nuevo empleado/i }).click();

    const modal = page.locator('.fixed').filter({ hasText: 'Nuevo empleado' });
    await expect(modal).toBeVisible();

    await modal.getByLabel('Primer nombre', { exact: true }).fill(ctx.nombre);
    await modal.getByLabel('Apellido paterno', { exact: true }).fill(ctx.apellido);
    await modal.getByLabel('Profesión', { exact: true }).fill(ctx.profesion);

    await modal.getByRole('button', { name: 'Crear empleado' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Empleado creado correctamente', { timeout: 30_000 });
    await expect(modal).not.toBeVisible();
  });

  test('ver card de empleado creado', async ({ page }) => {
    await page.goto('/equipo');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await expect(card).toBeVisible({ timeout: 20_000 });
    await expect(card.getByText(`${ctx.nombre} ${ctx.apellido}`)).toBeVisible();
    await expect(card.getByText(ctx.profesion)).toBeVisible();
  });

  test('ver detalle del empleado', async ({ page }) => {
    await page.goto('/equipo');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await card.getByTitle('Editar empleado').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Editar empleado' });
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel('Primer nombre', { exact: true })).toHaveValue(ctx.nombre);
    await expect(modal.getByLabel('Apellido paterno', { exact: true })).toHaveValue(ctx.apellido);
    await expect(modal.getByLabel('Profesión', { exact: true })).toHaveValue(ctx.profesion);

    await modal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('editar empleado', async ({ page }) => {
    await page.goto('/equipo');

    const card = page.locator('.card').filter({ hasText: ctx.nombre });
    await card.getByTitle('Editar empleado').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Editar empleado' });
    await expect(modal).toBeVisible();

    const nombreInput = modal.getByLabel('Primer nombre', { exact: true });
    await nombreInput.clear();
    await nombreInput.fill(ctx.nombreActualizado);

    await modal.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Empleado actualizado correctamente', { timeout: 30_000 });

    const updatedCard = page.locator('.card').filter({ hasText: ctx.nombreActualizado });
    await expect(updatedCard).toBeVisible({ timeout: 20_000 });
  });

  test('eliminar empleado', async ({ page }) => {
    await page.goto('/equipo');

    const card = page.locator('.card').filter({ hasText: ctx.nombreActualizado });
    await card.getByTitle('Eliminar empleado').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Eliminar empleado' });
    await expect(modal).toBeVisible({ timeout: 10_000 });

    await modal.getByRole('button', { name: 'Eliminar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Empleado eliminado correctamente', { timeout: 30_000 });

    await expect(page.locator('.card').filter({ hasText: ctx.nombreActualizado })).not.toBeVisible({ timeout: 20_000 });
  });
});
