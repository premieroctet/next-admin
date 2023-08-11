import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/admin`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin/);
});

