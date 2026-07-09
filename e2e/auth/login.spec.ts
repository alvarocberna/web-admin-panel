import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#btn-login').click();
  });

  test('muestra el formulario de login', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    await page.getByLabel('Email').fill(process.env.TEST_E2E_USER!);
    await page.getByLabel('Contraseña').fill(process.env.TEST_E2E_PASS!);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForURL('/dashboard', { timeout: 10_000 });
    await expect(page).toHaveURL('/dashboard');
  });

  test('credenciales incorrectas muestran toast de error', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@invalido.com');
    await page.getByLabel('Contraseña').fill('contraseñaWrong');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL('/');
  });

  test('campos vacíos muestran mensaje de validación', async ({ page }) => {
    await page.getByRole('button', { name: 'Entrar' }).click();

    const emailError = page.locator('span.text-red-400').first();
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Campo requerido');
  });

  test('ruta protegida sin sesión redirige al login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/', { timeout: 5_000 });
    await expect(page).toHaveURL('/');
  });
});
