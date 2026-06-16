import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('autenticar usuario', async ({ page }) => {
  await page.goto('/');

  await page.locator('#btn-login').click();

  await page.getByLabel('Email').fill(process.env.TEST_E2E_USER!);
  await page.getByLabel('Contraseña').fill(process.env.TEST_E2E_PASS!);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('/dashboard', { timeout: 10_000 });
  await expect(page).toHaveURL('/dashboard');

  await page.context().storageState({ path: authFile });
});
