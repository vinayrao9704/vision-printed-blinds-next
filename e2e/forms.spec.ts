import { test, expect } from '@playwright/test';

// NOTE ON SCOPE: the quote form has no backend/fetch call — see
// components/QuoteForm.tsx. There is no loading state, no disabled-while-
// submitting state, and no error-handling path to test, since none exists.
// These tests cover the native HTML5 validation and the actual static
// success flow that does exist, rather than mocking a fetch call the app
// never makes.

test.describe('Quote form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quote');
  });

  test('required fields block submission via native browser validation', async ({ page }) => {
    await page.getByRole('button', { name: /send my quote request/i }).click();
    // Still on the form, not the success screen
    await expect(page.getByRole('heading', { name: /request a quote/i })).toBeVisible();
    await expect(page.getByText(/quote request sent/i)).not.toBeVisible();

    const nameField = page.getByLabel(/full name/i);
    const isInvalid = await nameField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('an invalid email is rejected by native validation', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Smith');
    const emailField = page.getByLabel(/email address/i);
    await emailField.fill('not-an-email');
    const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('filling all required fields and submitting shows the success confirmation', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Smith');
    await page.getByLabel(/email address/i).fill('jane@example.com');
    await page.getByLabel(/tell us more about your project/i).fill('Two bedroom windows, blackout preferred.');
    await page.getByLabel(/i agree to be contacted/i).check();
    await page.getByRole('button', { name: /send my quote request/i }).click();

    await expect(page.getByRole('heading', { name: /quote request sent/i })).toBeVisible();
  });

  test('the consent checkbox is required to submit', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Smith');
    await page.getByLabel(/email address/i).fill('jane@example.com');
    await page.getByLabel(/tell us more about your project/i).fill('Details here.');
    // consent left unchecked
    await page.getByRole('button', { name: /send my quote request/i }).click();
    await expect(page.getByText(/quote request sent/i)).not.toBeVisible();
  });

  test('uploading a design file shows its name', async ({ page }) => {
    const fileInput = page.getByLabel(/upload your design file/i);
    await fileInput.setInputFiles({
      name: 'my-design.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-png-bytes'),
    });
    await expect(page.getByText('my-design.png')).toBeVisible();
  });

  test('BUG: the "Remove" button is obscured by the invisible file input and cannot actually be clicked', async ({ page }) => {
    // components/QuoteForm.tsx: .qf-upload__input is position:absolute;
    // inset:0 with z-index:3, covering the whole upload zone including the
    // "Remove" button that appears once a file is selected. A real user
    // clicking "Remove" hits the invisible file input instead — it silently
    // reopens the OS file picker rather than clearing the selection. This
    // test asserts the exact mechanism directly (what's under the button's
    // center point) rather than attempting a real click, which would just
    // hang for the full actionability-retry timeout since the click never
    // actually lands on the button in a real browser either.
    const fileInput = page.getByLabel(/upload your design file/i);
    await fileInput.setInputFiles({
      name: 'my-design.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-png-bytes'),
    });
    const removeButton = page.getByRole('button', { name: /remove/i });
    await expect(removeButton).toBeVisible();

    const elementOnTop = await removeButton.evaluate((btn) => {
      const rect = btn.getBoundingClientRect();
      const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return el === btn;
    });
    expect(elementOnTop, 'expected the Remove button to be the topmost element at its own center point').toBe(true);
  });
});
