# Vision Printed Blinds

Marketing site and custom blind design tool for Vision Printed Blinds (Edmonton, AB), built with Next.js 15 (App Router), TypeScript, and React 19.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Project Structure

- `app/` — routed pages (`/`, `/custom`, `/shop`, `/rooms`, `/gallery`, `/about`, `/quote`)
- `components/` — shared UI (`Nav`, `Footer`, `ShopCatalog`, `QuoteForm`, `GalleryGrid`, etc.) and the `blind-designer/` module (window detection + perspective-warped design preview)
- `lib/` — pure logic: `homography.ts` (perspective math), `windowDetection.ts` (OpenCV.js-based window detection), `products.ts` (catalog data)
- `styles/` — global CSS (no CSS Modules/Tailwind — plain stylesheets imported in `app/layout.tsx`)

## Testing

The project has two layers of automated tests: **unit/component tests** (Jest + React Testing Library) for logic and isolated component behavior, and **end-to-end tests** (Playwright) for real-browser, cross-device, and full-page verification.

### Running the tests

```bash
npm test              # unit/component tests, single run
npm run test:watch    # unit/component tests, watch mode
npm run test:coverage # unit/component tests with a coverage report
npm run test:e2e      # full E2E suite (builds + starts the app automatically)
npm run test:e2e:ui   # E2E suite in Playwright's interactive UI mode — best for debugging a specific failure
npm run test:all      # unit tests, then E2E
```

`test:e2e` builds the app and starts it on port 3100 automatically (see `playwright.config.ts`'s `webServer` block) — you don't need a dev server running first. If one is already running on that port, Playwright reuses it locally (not in CI).

### What's covered

**Unit/component tests** (`__tests__/`, run via Jest + `next/jest`):
- `lib/homography.ts` — the perspective-transform math (identity, pure scale, true perspective quads, matrix inversion round-trips)
- `lib/windowDetection.ts` — the geometry helpers behind the CV pipeline (polygon area, point-in-polygon, quad ordering, IoU dedup)
- `lib/products.ts` — catalog data integrity (unique IDs, required fields, every tag has a label)
- Every shared component — renders correctly, responds to props, handles interaction (tabs, filters, modals, accordions, drag), and a couple of snapshot tests for stable presentational components
- `QuoteForm` — native HTML5 validation behavior, the file-upload flow, and the actual (static, no-backend) success path

A few previously module-private pure helper functions (`lerp`, `corners4`, `defaultQuad`, `validateFile` in `BlindPreviewTool.tsx`; `polygonArea`, `pointInPolygon`, `orderQuadPoints`, `bboxIoU` in `windowDetection.ts`; `detailRows` in `ShopCatalog.tsx`) were exported specifically to make them unit-testable — a visibility-only change with no behavior difference.

**E2E tests** (`e2e/`, run via Playwright across 5 projects: Mobile Chrome/390px, Tablet Chrome/768px, and Desktop Chromium/WebKit/Firefox at 1440px):
- `pages.spec.ts` — every route loads with a 200, no console errors, no failed requests, key section visible
- `responsive.spec.ts` — hamburger vs. full nav per viewport, no horizontal overflow, images actually load when scrolled into view, 44px+ touch targets on mobile, grid column counts change at the right breakpoints
- `navigation.spec.ts` — every internal link resolves, active nav-link highlighting, unknown-route behavior
- `accessibility.spec.ts` — axe scan per page (zero serious/critical violations), alt text on every image, logical heading order, keyboard navigation (Tab order, focus visibility, Escape closes the mobile menu)
- `forms.spec.ts` — the quote form's native validation and success flow
- `seo.spec.ts` — unique titles, meta descriptions, Open Graph tags, the viewport meta tag, canonical URLs, robots.txt/sitemap.xml (skipped, not failed, if not configured)
- `performance.spec.ts` — every image is either `next/image` or explicitly lazy-loaded; home page LCP under 2.5s (desktop only)
- `visual.spec.ts` — full-page screenshot comparison of every route across all 5 projects

The `/custom` page's window-detection feature loads OpenCV.js from a CDN on first use; E2E tests intercept and abort that request (see `e2e/helpers.ts`'s `blockOpenCV`) so tests exercise the app's own manual-fallback path deterministically instead of depending on a real ~10MB network fetch.

**A few tests are intentionally written to fail** because they document confirmed bugs in the app rather than being bugs in the tests themselves — see the project's test report for the full list (color contrast, a heading-order issue in the nav's mega menu, a mobile nav-bar overflow, a click-blocking bug in the quote form's file upload, and a horizontal-scroll bug on the Quote page at phone widths). Per the project's own testing guidelines, these were reported rather than silently fixed or removed — fixing them requires sign-off since they change app behavior, not just test coverage.

### Updating visual regression baselines

Screenshots live in `e2e/*-snapshots/`. After an intentional visual change:

```bash
npx playwright test e2e/visual.spec.ts --update-snapshots
```

Review the diffs in the generated files before committing them — an unreviewed baseline update can hide a real regression.

### Accessibility and coverage tooling

- `jest-axe` is available for accessibility assertions inside component tests (`toHaveNoViolations()`); the E2E suite's `@axe-core/playwright` scans are the primary a11y coverage.
- `npm run test:coverage` writes an HTML report to `coverage/lcov-report/index.html`.
