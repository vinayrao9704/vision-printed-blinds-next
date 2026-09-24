import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV, collectPageErrors } from './helpers';

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) loads with 200, no console errors, no failed requests, key section visible`, async ({ page }) => {
    await blockOpenCV(page);
    const { consoleErrors, failedRequests } = collectPageErrors(page);

    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);

    await expect(page.locator(route.keySection)).toBeVisible();

    // give the page a beat to finish any async console noise (e.g. font loads)
    await page.waitForLoadState('networkidle').catch(() => {});

    expect(consoleErrors, `console errors on ${route.path}:\n${consoleErrors.join('\n')}`).toEqual([]);
    expect(failedRequests, `failed requests on ${route.path}:\n${failedRequests.join('\n')}`).toEqual([]);
  });
}

test('nav and footer render on every page', async ({ page }) => {
  await blockOpenCV(page);
  for (const route of ROUTES) {
    await page.goto(route.path);
    await expect(page.locator('nav#navbar')).toBeVisible();
    await expect(page.locator('footer.footer')).toBeVisible();
  }
});
