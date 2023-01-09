import { expect, test } from '@playwright/test';

test('home page', async ({ page, isMobile }) => {
  // Test url
  await Promise.all([page.waitForNavigation(), page.goto('.')]);
  await expect(page.getByRole('progressbar')).toHaveCount(0);

  // Test click overview
  if (isMobile) await page.getByRole('button', { name: 'open navigation menu' }).first().click();
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('link', { name: 'Overview' }).first().click(),
  ]);
  await expect(page.getByRole('progressbar')).toHaveCount(0);

  if (await page.getByRole('button', { name: 'close navigation menu' }).isVisible()) {
    await page.getByRole('button', { name: 'close navigation menu' }).click();
  }

  // Test a title
  await expect(page).toHaveTitle(/Big Dipper/);

  if (!isMobile) {
    // Test language change
    await page.getByRole('button', { name: 'settings-button' }).first().click();
    await page.getByRole('button', { name: 'Save' }).waitFor();
    await page.getByRole('button', { name: 'Save' }).first().click();

    // Test theme change
    await page.getByRole('button', { name: 'settings-button' }).first().click();
    await page.getByRole('button', { name: 'Save' }).waitFor();
    await page.getByRole('button', { name: 'Light' }).first().click();
    await page.getByRole('option', { name: 'Dark' }).first().click();
    await page.getByRole('button', { name: 'Save' }).first().click();

    // Test date format change
    await page.getByRole('button', { name: 'settings-button' }).first().click();
    await page.getByRole('button', { name: 'Save' }).waitFor();
    await page.getByRole('button', { name: 'Locale' }).first().click();
    await page.getByRole('option', { name: 'UTC' }).first().click();
    await page.getByRole('button', { name: 'Save' }).first().click();

    // Test transactions format change
    await page.getByRole('button', { name: 'settings-button' }).first().click();
    await page.getByRole('button', { name: 'Save' }).waitFor();
    await page.getByRole('button', { name: 'Compact' }).first().click();
    await page.getByRole('option', { name: 'Detailed' }).first().click();
    await page.getByRole('button', { name: 'Save' }).first().click();
  }

  // Test 'See More' blocks button
  await Promise.all([
    page.waitForNavigation({ url: /\/blocks/ }),
    page.getByRole('link', { name: 'see more blocks' }).first().click(),
  ]);

  if (isMobile) await page.getByRole('button', { name: 'open navigation menu' }).first().click();
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('link', { name: 'Overview' }).first().click(),
  ]);

  // Test 'See More' transactions button
  await Promise.all([
    page.waitForNavigation({ url: /\/transactions/ }),
    page.getByRole('link', { name: 'see more txs' }).first().click(),
  ]);
});