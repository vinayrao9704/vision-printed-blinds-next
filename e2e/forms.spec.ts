import { test, expect } from '@playwright/test';

test.describe('Quote form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quote');
  });

  async function fillRequiredFields(page: import('@playwright/test').Page) {
    await page.getByLabel(/full name/i).fill('Jane Smith');
    await page.getByLabel(/phone number/i).fill('780-555-0100');
    await page.getByLabel(/email address/i).fill('jane@example.com');
    await page.getByLabel(/^message/i).fill('Two bedroom windows, blackout preferred.');
    await page.getByLabel(/i agree to be contacted/i).check();
  }

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

  test('the type of property chips default to Residential', async ({ page }) => {
    await expect(page.getByRole('radio', { name: /residential/i })).toBeChecked();
    await expect(page.getByRole('radio', { name: /commercial/i })).not.toBeChecked();
    await page.getByRole('radio', { name: /commercial/i }).check();
    await expect(page.getByRole('radio', { name: /commercial/i })).toBeChecked();
  });

  test('the consent checkbox is required to submit', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Smith');
    await page.getByLabel(/phone number/i).fill('780-555-0100');
    await page.getByLabel(/email address/i).fill('jane@example.com');
    await page.getByLabel(/^message/i).fill('Details here.');
    // consent left unchecked
    await page.getByRole('button', { name: /send my quote request/i }).click();
    await expect(page.getByText(/quote request sent/i)).not.toBeVisible();
  });
});
