import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV } from './helpers';

// Baselines only exist for these three projects (see playwright.config.ts).
// The extra width-coverage projects added for responsive QA run every other
// spec but skip visual regression rather than fail on a missing baseline.
const SNAPSHOT_PROJECTS = new Set(['mobile-chrome', 'tablet-chrome', 'desktop-chromium', 'desktop-webkit']);

test.describe('visual regression', () => {
  for (const route of ROUTES) {
    test(`${route.name} matches its visual baseline`, async ({ page }, testInfo) => {
      test.skip(!SNAPSHOT_PROJECTS.has(testInfo.project.name), 'no baseline recorded for this project');
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
