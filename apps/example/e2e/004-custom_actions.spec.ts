import { test, expect } from "@playwright/test";

test.describe("User's custom actions", () => {
  test("Submit email", async ({ page }) => {
    page.on("dialog", (page) => page.accept());
    await page.goto(`${process.env.BASE_URL}/user`);
    await expect(page.getByTestId("actions-dropdown")).not.toBeVisible();

    const checkboxes = page.locator('table input[type="checkbox"]');
    await checkboxes.first().check();
    await checkboxes.nth(2).check();

    await expect(page.getByTestId("actions-dropdown")).toBeVisible();
    await page.getByTestId("actions-dropdown").click();
    await expect(page.getByText("Send email")).toBeVisible();

    await page.getByText("Send email").click();
    await page.waitForURL((url) => !!url.searchParams.get("message"));
    await expect(page.getByText("Email sent successfully")).toBeVisible();
  });

  test("Delete user", async ({ page }) => {
    page.on("dialog", (page) => page.accept());
    await page.goto(`${process.env.BASE_URL}/user?page=3`);
    await expect(page.getByTestId("actions-dropdown")).not.toBeVisible();

    const checkboxes = page.locator('table input[type="checkbox"]');
    await checkboxes.nth(4).check();
    await checkboxes.last().check();

    await expect(page.getByTestId("actions-dropdown")).toBeVisible();
    await page.getByTestId("actions-dropdown").click();
    await expect(
      page.getByTestId("actions-dropdown-content").getByText("Delete")
    ).toBeVisible();

    await page
      .getByTestId("actions-dropdown-content")
      .getByText("Delete")
      .click();
    await page.waitForURL((url) => !!url.searchParams.get("message"));
    await expect(page.getByText("Deleted successfully")).toBeVisible();
    await expect(page.locator("table tbody tr")).toHaveCount(3);
  });
});
