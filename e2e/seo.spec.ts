import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV } from './helpers';

test.describe('page titles', () => {
  test('every page has a non-empty title, and titles are unique across the site', async ({ page }) => {
    await blockOpenCV(page);
    const titles: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route.path);
      const title = await page.title();
      expect(title.trim().length, `${route.path} has an empty title`).toBeGreaterThan(0);
      titles.push(title);
    }
    expect(new Set(titles).size, `titles were not all unique:\n${titles.join('\n')}`).toBe(titles.length);
  });
});

test.describe('meta description', () => {
  for (const route of ROUTES) {
    test(`${route.name} has a non-empty meta description`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      const content = await page.locator('meta[name="description"]').getAttribute('content');
      expect(content?.trim().length ?? 0).toBeGreaterThan(0);
    });
  }
});

test.describe('Open Graph tags', () => {
  for (const route of ROUTES) {
    test(`${route.name} has og:title, og:description and og:type`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogTitle?.trim().length ?? 0).toBeGreaterThan(0);
      expect(ogDesc?.trim().length ?? 0).toBeGreaterThan(0);
      expect(ogType?.trim().length ?? 0).toBeGreaterThan(0);
    });
  }
});

test.describe('viewport meta tag', () => {
  test('the viewport meta tag is present with device-width and initial-scale=1', async ({ page }) => {
    await page.goto('/');
    const content = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
  });
});

test.describe('canonical URL', () => {
  for (const route of ROUTES) {
    test(`${route.name} has a canonical link tag`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      // .count() resolves immediately either way; .getAttribute() on a
      // locator that matches nothing instead waits the full default
      // actionability timeout (~30s) before giving up, since it can't tell
      // "genuinely absent" from "not rendered yet" — expensive multiplied
      // across every page and browser project for a tag that's confirmed
      // absent from every page's metadata.
      const count = await page.locator('link[rel="canonical"]').count();
      expect(count, `no <link rel="canonical"> found on ${route.path} — alternates.canonical is not configured in this page's metadata`).toBeGreaterThan(0);
    });
  }
});

test.describe('robots.txt and sitemap.xml', () => {
  test('robots.txt is served if configured', async ({ request }) => {
    const res = await request.get('/robots.txt');
    test.skip(res.status() === 404, 'robots.txt is not configured (no app/robots.ts or public/robots.txt) — skipping rather than failing, per spec');
    expect(res.status()).toBe(200);
  });

  test('sitemap.xml is served if configured', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    test.skip(res.status() === 404, 'sitemap.xml is not configured (no app/sitemap.ts or public/sitemap.xml) — skipping rather than failing, per spec');
    expect(res.status()).toBe(200);
  });
});
