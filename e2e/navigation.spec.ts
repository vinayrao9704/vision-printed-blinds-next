import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV } from './helpers';

test.describe('internal links resolve without 404s', () => {
  for (const route of ROUTES) {
    test(`every internal link on ${route.name} resolves successfully`, async ({ page, request }) => {
      await blockOpenCV(page);
      await page.goto(route.path);

      const hrefs = await page.$$eval('a[href]', (as) =>
        Array.from(new Set(
          as
            .map((a) => a.getAttribute('href') || '')
            .filter((h) => h.startsWith('/') && !h.startsWith('//')) // internal, non-protocol-relative
            .map((h) => h.split('#')[0]) // strip in-page anchors before checking the route itself
            .filter(Boolean)
        ))
      );

      for (const href of hrefs) {
        const res = await request.get(href);
        expect(res.status(), `${href} linked from ${route.path}`).toBeLessThan(400);
      }
    });
  }
});

test.describe('active nav link highlighting', () => {
  const navPages: { path: string; linkName: string }[] = [
    { path: '/custom', linkName: 'Custom Printing' },
    { path: '/gallery', linkName: 'Gallery' },
    { path: '/measure-guide', linkName: 'Measuring Guide' },
    { path: '/about', linkName: 'About' },
    { path: '/quote', linkName: 'Contact' },
  ];

  for (const { path, linkName } of navPages) {
    test(`${path} highlights "${linkName}" as the active nav link`, async ({ page }) => {
      const width = page.viewportSize()!.width;
      // The active-link CSS/logic only exists on .nav__links (the desktop
      // row) — Nav.tsx never applies it to .nav__mobile-links' duplicate
      // entries, so this feature genuinely doesn't apply below the 1024px
      // breakpoint where .nav__links is hidden.
      test.skip(width < 1025, 'active-link highlighting only exists in the desktop nav, not the mobile menu');

      await page.goto(path);
      // Scoped to .nav__links specifically (not the whole <nav>) — the
      // footer's "Pages" list and the mobile menu both happen to repeat some
      // of the same link text (e.g. "Custom Printing") without highlighting.
      // Substring match because the real nav link is "★ Custom Printing".
      const link = page.locator('.nav__links').getByRole('link', { name: new RegExp(linkName) }).first();
      await expect(link).toHaveClass(/\bactive\b/);
    });
  }
});

test.describe('unknown routes', () => {
  test('an unknown route returns a 404 status', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('an unknown route still shows some fallback content rather than a blank page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });
});
