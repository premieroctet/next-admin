import { test, expect } from "@playwright/test";

test.describe("Custom pages", () => {
  test("Custom page should be visible and clickable", async ({ page }) => {
    await page.goto(process.env.BASE_URL!);

    await page.click(`a[href$="/custom"]`);

    await expect(page.getByText("This is a custom page")).toBeVisible();
  });
});
