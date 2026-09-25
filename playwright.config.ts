import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 30_000,
  expect: {
    timeout: 8_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    // ---- Responsive device coverage ----
    {
      name: 'mobile-chrome',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad (gen 7)'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    // ---- Extra width coverage matching the site's documented QA matrix
    // (375/414/1024/1280/1920) that the three projects above don't already
    // hit. Functional specs run here too; visual.spec.ts's own snapshot
    // list is left targeting the three projects above so existing
    // baselines stay valid.
    {
      name: 'mobile-375',
      use: { ...devices['iPhone SE'], viewport: { width: 375, height: 667 } },
    },
    {
      name: 'mobile-414',
      use: { ...devices['iPhone 13 Pro Max'], viewport: { width: 414, height: 896 } },
    },
    {
      name: 'laptop-1024',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'laptop-1280',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-1920',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
    // ---- Cross-browser coverage (desktop) ----
    // Firefox is intentionally excluded — its binary fails to launch in this
    // environment (exit code 255, unrelated to app code); re-add a
    // desktop-firefox project here if that's ever fixed.
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
