import { test, expect } from '@playwright/test';

test.describe('image loading strategy', () => {
  test('every <img> on the home page is either a next/image (data-nimg) or explicitly lazy-loaded', async ({ page }) => {
    await page.goto('/');
    const offenders = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => !img.hasAttribute('data-nimg') && img.getAttribute('loading') !== 'lazy')
        .map((img) => img.src)
    );
    expect(offenders, `images with neither next/image nor loading="lazy":\n${offenders.join('\n')}`).toEqual([]);
  });
});

test.describe('Largest Contentful Paint', () => {
  test('home page LCP is under 2.5s on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'LCP threshold is measured on desktop only, per spec');

    await page.goto('/', { waitUntil: 'load' });
    // give any late-arriving LCP candidate (e.g. a lazy hero background) a moment to register
    await page.waitForTimeout(500);

    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const entries = performance.getEntriesByType('largest-contentful-paint');
          if (entries.length > 0) {
            resolve(entries[entries.length - 1].startTime);
            return;
          }
          // Fallback: observe briefly in case the entry hasn't landed in the buffer yet.
          const obs = new PerformanceObserver((list) => {
            const list_entries = list.getEntries();
            if (list_entries.length > 0) resolve(list_entries[list_entries.length - 1].startTime);
          });
          obs.observe({ type: 'largest-contentful-paint', buffered: true });
          setTimeout(() => resolve(0), 1000);
        })
    );

    expect(lcp, 'no LCP entry was recorded at all').toBeGreaterThan(0);
    expect(lcp).toBeLessThan(2500);
  });
});
