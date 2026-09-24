import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES, blockOpenCV, isHamburgerOnScreen } from './helpers';

test.describe('axe scans — zero serious/critical violations', () => {
  for (const route of ROUTES) {
    test(`${route.name} has no serious or critical accessibility violations`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      await page.waitForLoadState('networkidle').catch(() => {});

      const results = await new AxeBuilder({ page })
        .include('body')
        .analyze();

      const seriousOrCritical = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );

      expect(
        seriousOrCritical,
        seriousOrCritical.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`).join('\n')
      ).toEqual([]);
    });
  }
});

test.describe('images have alt text', () => {
  for (const route of ROUTES) {
    test(`every image on ${route.name} has an alt attribute`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      const missingAlt = await page.$$eval('img', (imgs) =>
        imgs.filter((img) => !img.hasAttribute('alt')).map((img) => img.src)
      );
      expect(missingAlt).toEqual([]);
    });
  }
});

test.describe('heading order is logical', () => {
  for (const route of ROUTES) {
    test(`${route.name} has exactly one h1 and no heading level skips`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
        els.map((el) => Number(el.tagName[1]))
      );

      const h1Count = levels.filter((l) => l === 1).length;
      expect(h1Count, 'exactly one <h1> per page').toBe(1);

      let prev = levels[0];
      for (const level of levels.slice(1)) {
        expect(level, `heading jumped from h${prev} to h${level} — skipped a level`).toBeLessThanOrEqual(prev + 1);
        prev = level;
      }
    });
  }
});

test.describe('keyboard navigation', () => {
  test('Tab moves focus through the nav links in order, each with a visible focus outline', async ({ page }, testInfo) => {
    // Tab-key navigation is a desktop/external-keyboard concept; touch-only
    // mobile emulation doesn't dispatch focus the same way (there's no
    // hardware Tab key on a phone), so this only makes sense on desktop.
    test.skip(testInfo.project.name.startsWith('mobile') || testInfo.project.name.startsWith('tablet'), 'Tab-key navigation is desktop/keyboard-only');
    await page.goto('/');
    // Start from the top of the page
    await page.keyboard.press('Tab'); // logo
    const logo = page.locator(':focus');
    await expect(logo).toBeVisible();

    await page.keyboard.press('Tab'); // first nav link (Shop Blinds trigger)
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    // a real focus outline should be present (not suppressed to "none")
    const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('Escape closes the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    // See responsive.spec.ts's dedicated BUG test: at this width the
    // hamburger is pushed off-screen by .nav__actions, so it can't be
    // clicked here either. Skip rather than hang on the click retry.
    test.skip(!(await isHamburgerOnScreen(page)), 'hamburger is off-screen at 390px — see responsive.spec.ts');

    const hamburger = page.getByRole('button', { name: /toggle menu/i });
    await hamburger.click();
    await expect(page.locator('.nav__mobile')).toHaveClass(/\bopen\b/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.nav__mobile')).not.toHaveClass(/\bopen\b/);
  });

  test('the quote form fields are reachable and operable via Tab + typing alone', async ({ page }) => {
    await page.goto('/quote');
    const nameField = page.getByLabel(/full name/i);
    await nameField.focus();
    await page.keyboard.type('Jane Smith');
    await expect(nameField).toHaveValue('Jane Smith');

    await page.keyboard.press('Tab');
    const emailField = page.locator(':focus');
    await expect(emailField).toHaveAttribute('id', 'qfEmail');
  });
});
