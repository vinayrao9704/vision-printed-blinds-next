import type { Page } from '@playwright/test';

export interface RouteInfo {
  path: string;
  name: string;
  /** A locator selector guaranteed to be visible once the page's main content has rendered. */
  keySection: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/', name: 'Home', keySection: '#hero' },
  { path: '/custom', name: 'Custom Printing', keySection: '#preview-tool' },
  { path: '/shop', name: 'Shop', keySection: '#shop' },
  { path: '/shop/zebra-plain', name: 'Product Detail', keySection: '.pdp-grid' },
  { path: '/gallery', name: 'Gallery', keySection: '.gallery-masonry' },
  { path: '/measure-guide', name: 'Measure Guide', keySection: '.mg-toggle' },
  { path: '/about', name: 'About', keySection: '#faq' },
  { path: '/quote', name: 'Quote', keySection: '.quote-layout' },
];

const OPENCV_URL_PATTERN = /opencv-js|opencv\.js/;

/**
 * The /custom page's window-detection pipeline loads OpenCV.js (~10MB WASM)
 * from a CDN on first use. Letting that hit the real network in every test
 * that visits /custom would be slow and flaky in CI, so this aborts the
 * request — the app's own fallback path (confirmed working in earlier manual
 * testing) then takes over immediately and deterministically.
 */
export async function blockOpenCV(page: Page) {
  await page.route(OPENCV_URL_PATTERN, (route) => route.abort());
}

/** Collects console "error"-level messages and failed network requests over the page's lifetime. */
export function collectPageErrors(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    // OpenCV.js is intentionally aborted in tests that call blockOpenCV(); don't count that as a bug.
    if (OPENCV_URL_PATTERN.test(req.url())) return;
    failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && !OPENCV_URL_PATTERN.test(res.url())) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  return { consoleErrors, failedRequests };
}

/**
 * BUG (styles.css): .nav__actions (the desktop "Get a Free Quote" button) has
 * no media query hiding it below the 1024px breakpoint and is flex-shrink:0,
 * so on phone-width viewports it forces the nav's flex row to overflow,
 * pushing the hamburger button off the right edge of the screen entirely —
 * confirmed via bounding-box measurement, not just a horizontal-scrollbar
 * symptom. This makes the mobile menu unclickable on real phones. Tests that
 * need to click the hamburger use a short timeout (via this helper) rather
 * than hanging for the full default 30s retry-until-actionable window.
 */
export async function isHamburgerOnScreen(page: Page): Promise<boolean> {
  const box = await page.getByRole('button', { name: /toggle menu/i }).boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) return false;
  return box.x >= 0 && box.x + box.width <= viewport.width;
}
