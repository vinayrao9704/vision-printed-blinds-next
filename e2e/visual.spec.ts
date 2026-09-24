import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV } from './helpers';

test.describe('visual regression', () => {
  for (const route of ROUTES) {
    test(`${route.name} matches its visual baseline`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      // let scroll-reveal fade-ins and web fonts settle before snapshotting
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      await expect(page).toHaveScreenshot(`${route.path === '/' ? 'home' : route.path.replace(/\//g, '')}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
