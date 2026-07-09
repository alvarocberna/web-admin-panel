import { test, expect } from '@playwright/test';

test.describe('CRUD Usuarios (rol USER)', () => {

  const ctx = { nombre: '', apellido: '', email: '', password: '', nombreActualizado: '' };

  test.beforeAll(() => {
    const ts = Date.now();
    ctx.nombre = `E2E${ts}`;
    ctx.apellido = `User${ts}`;
    ctx.email = `e2e.user.${ts}@example.com`;
    ctx.password = `TestPassword${ts}`;
    ctx.nombreActualizado = `${ctx.nombre}Editado`;
  });

  test('crear usuario con rol USER', async ({ page }) => {
    await page.goto('/usuarios');

    await page.getByRole('button', { name: /Nuevo usuario/i }).click();

    const modal = page.locator('.fixed').filter({ hasText: 'Nuevo usuario' });
    await expect(modal).toBeVisible();

    await modal.getByLabel('Nombre', { exact: true }).fill(ctx.nombre);
    await modal.getByLabel('Apellido', { exact: true }).fill(ctx.apellido);
    await modal.getByLabel('Correo electrónico', { exact: true }).fill(ctx.email);
    await modal.getByLabel('Contraseña', { exact: true }).fill(ctx.password);
    await modal.getByLabel('Rol', { exact: true }).selectOption('USER');

    await modal.getByRole('button', { name: 'Crear usuario' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Usuario creado correctamente', { timeout: 30_000 });
    await expect(modal).not.toBeVisible();

    const row = page.locator('tr').filter({ hasText: ctx.email });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await expect(row.getByText('USER', { exact: true })).toBeVisible();
  });

  test('editar usuario con rol USER', async ({ page }) => {
    await page.goto('/usuarios');

    const row = page.locator('tr').filter({ hasText: ctx.email });
    await row.getByTitle('Editar usuario').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Editar usuario' });
    await expect(modal).toBeVisible();
    await expect(modal.getByLabel('Correo electrónico', { exact: true })).toHaveValue(ctx.email);
    await expect(modal.getByLabel('Rol', { exact: true })).toHaveValue('USER');

    const nombreInput = modal.getByLabel('Nombre', { exact: true });
    await nombreInput.clear();
    await nombreInput.fill(ctx.nombreActualizado);

    await modal.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Usuario actualizado correctamente', { timeout: 30_000 });

    const updatedRow = page.locator('tr').filter({ hasText: ctx.email });
    await expect(updatedRow).toBeVisible({ timeout: 20_000 });
    await expect(updatedRow.getByText(ctx.nombreActualizado, { exact: false })).toBeVisible();
  });

  test('eliminar usuario con rol USER', async ({ page }) => {
    await page.goto('/usuarios');

    const row = page.locator('tr').filter({ hasText: ctx.email });
    await row.getByTitle('Eliminar usuario').click();

    const modal = page.locator('.fixed').filter({ hasText: 'Eliminar usuario' });
    await expect(modal).toBeVisible({ timeout: 10_000 });

    await modal.getByRole('button', { name: 'Eliminar' }).click();

    await expect(page.locator('.Toastify__toast')).toContainText('Usuario eliminado correctamente', { timeout: 30_000 });

    await expect(page.locator('tr').filter({ hasText: ctx.email })).not.toBeVisible({ timeout: 20_000 });
  });
});
