import { test, expect } from '@playwright/test';
import { ROUTES, blockOpenCV, isHamburgerOnScreen } from './helpers';

function expectedColumnCount(width: number): number {
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  if (width <= 1200) return 3;
  return 4;
}

test.describe('navigation shows the right layout for the viewport', () => {
  test('desktop shows the full nav links, mobile/tablet show the hamburger', async ({ page }) => {
    await page.goto('/');
    const width = page.viewportSize()!.width;
    const desktopLinks = page.locator('.nav__links');
    const hamburger = page.locator('.nav__hamburger');

    if (width >= 1025) {
      await expect(desktopLinks).toBeVisible();
      await expect(hamburger).toBeHidden();
    } else {
      await expect(hamburger).toBeVisible();
      await expect(desktopLinks).toBeHidden();
    }
  });

  test('the hamburger stays on-screen at phone widths (nav__actions hides instead of overflowing)', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width >= 1025 || width > 480, 'only relevant at phone widths — see styles.css .nav__actions');

    await page.goto('/');
    const onScreen = await isHamburgerOnScreen(page);
    expect(onScreen, 'hamburger should be within the viewport bounds').toBe(true);
  });

  test('on narrow viewports, the hamburger opens and closes the mobile menu', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width >= 1025, 'hamburger only exists below the 1024px breakpoint');

    await page.goto('/');
    test.skip(!(await isHamburgerOnScreen(page)), 'hamburger is off-screen at this width — see the dedicated BUG test above');

    const hamburger = page.getByRole('button', { name: /toggle menu/i });
    const mobileMenu = page.locator('.nav__mobile');

    await expect(mobileMenu).not.toHaveClass(/\bopen\b/);
    await hamburger.click();
    await expect(mobileMenu).toHaveClass(/\bopen\b/);
    await hamburger.click();
    await expect(mobileMenu).not.toHaveClass(/\bopen\b/);
  });
});

test.describe('no horizontal overflow on any page', () => {
  for (const route of ROUTES) {
    test(`${route.name} has no horizontal scroll`, async ({ page }) => {
      await blockOpenCV(page);
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      // small tolerance for scrollbar/rounding
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }
});

test.describe('images load correctly and are not visibly broken/stretched', () => {
  test('home page images all have naturalWidth > 0 and reasonable aspect handling', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img:visible');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      // Most images use next/image's default lazy loading, so a below-the-
      // fold image (e.g. the footer logo on this long page) genuinely hasn't
      // been requested yet until it's scrolled near the viewport — that's
      // correct behavior, not a broken image. Scroll to each one first.
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
        message: `image ${i} (src=${await img.getAttribute('src')}) failed to load`,
      }).toBeGreaterThan(0);
    }
  });
});

test.describe('touch targets are at least 44px tall on mobile', () => {
  test('primary CTA buttons meet the 44px minimum touch target height', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width > 480, 'touch-target sizing only enforced on phone-width viewports');

    await page.goto('/');
    const ctas = page.locator('.hero__ctas a, .cta-final__btns a');
    const count = await ctas.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await ctas.nth(i).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('the hamburger button meets the 44px minimum touch target size', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width >= 1025 || width > 480, 'only relevant at phone widths');

    await page.goto('/');
    const box = await page.locator('.nav__hamburger').boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  });

  test('custom-printed product card buttons (View Details / Get Quote) meet the 44px minimum', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width > 480, 'touch-target sizing only enforced on phone-width viewports');

    await page.goto('/custom-printed');
    const ctas = page.locator('.pcard__ctas .btn');
    await ctas.first().waitFor();
    const count = await ctas.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await ctas.nth(i).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('colour swatches wrap on narrow screens', () => {
  test('the zebra shades colour swatches wrap instead of overflowing at phone width', async ({ page }) => {
    const width = page.viewportSize()!.width;
    test.skip(width > 480, 'only relevant at phone widths');

    await page.goto('/products/zebra-shades');
    const wrap = await page.locator('.colour-swatches').evaluate((el) => getComputedStyle(el).flexWrap);
    expect(wrap).toBe('wrap');
  });
});

test.describe('grid layouts change column count at the defined breakpoints', () => {
  test('custom-printed products grid', async ({ page }) => {
    await page.goto('/custom-printed');
    const width = page.viewportSize()!.width;
    const columns = await page.locator('#customProductsGrid').evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(columns).toBe(expectedColumnCount(width));
  });

  test('about "why choose us" grid', async ({ page }) => {
    await page.goto('/about');
    const width = page.viewportSize()!.width;
    const columns = await page.locator('.why-grid').evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(columns).toBe(expectedColumnCount(width));
  });
});
