import { expect, test } from "@playwright/test";

test.describe("Custom pages", () => {
  test("Custom page should be visible and clickable", async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    await page.click(`a[href$="/custom"]`);

    await expect(
      page.locator("h1", {
        hasText: "Dashboard",
      })
    ).toBeVisible();

    // await page.getByText("Create random post").click();
    // await page.waitForURL((url) => url.pathname.includes("/post/"));
    // await expect(page.getByText("Random post created")).toBeVisible();
  });
});
