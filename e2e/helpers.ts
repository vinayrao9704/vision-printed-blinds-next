import type { Page } from '@playwright/test';

export interface RouteInfo {
  path: string;
  name: string;
  /** A locator selector guaranteed to be visible once the page's main content has rendered. */
  keySection: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/', name: 'Home', keySection: '#hero' },
  { path: '/shop', name: 'Shop', keySection: '#shop' },
  { path: '/shop/zebra-plain', name: 'Product Detail', keySection: '.pdp-grid' },
  { path: '/gallery', name: 'Gallery', keySection: '.gallery-masonry' },
  { path: '/measure-guide', name: 'Measure Guide', keySection: '.mg-toggle' },
  { path: '/about', name: 'About', keySection: '#faq' },
  { path: '/quote', name: 'Quote', keySection: '.quote-layout' },
];

const OPENCV_URL_PATTERN = /opencv-js|opencv\.js/;

/**
 * Historical safety net from when window detection loaded OpenCV.js
 * (~10MB WASM) from a CDN — that pipeline was replaced with a dependency-free
 * heuristic long ago, and /custom itself is currently disabled and redirects
 * home. Left in place (and still called broadly) in case either ever comes
 * back; it's a harmless no-op otherwise since nothing requests this URL.
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
 * Confirms the hamburger button is actually within the viewport bounds
 * (not just present in the DOM) before a test tries to click it — guards
 * against silently hanging for the full default 30s retry-until-actionable
 * window if a future layout regression ever pushes it off-screen again.
 */
export async function isHamburgerOnScreen(page: Page): Promise<boolean> {
  const box = await page.getByRole('button', { name: /toggle menu/i }).boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) return false;
  return box.x >= 0 && box.x + box.width <= viewport.width;
}
