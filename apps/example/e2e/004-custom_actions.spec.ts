import { expect, test } from "@playwright/test";

test.describe("User's custom actions", () => {
  test("Submit email", async ({ page }) => {
    page.on("dialog", (page) => page.accept());
    await page.goto(`${process.env.BASE_URL}/user`);
    await expect(page.getByTestId("actions-dropdown")).not.toBeVisible();

    const checkboxes = page.locator('table button[role="checkbox"]');
    await checkboxes.nth(2).check();
    await checkboxes.nth(3).check();

    await expect(page.getByTestId("actions-dropdown")).toBeVisible();
    await page.getByTestId("actions-dropdown").click();
    await expect(page.getByText("Send email")).toBeVisible();

    const response = page.waitForResponse(
      (response) =>
        response.url().includes("/submit-email") && response.status() === 200
    );
    await page.getByText("Send email").click();
    await response;

    await expect(page.getByText("Email sent successfully")).toBeVisible();
  });

  test("Delete user", async ({ page }) => {
    page.on("dialog", (page) => page.accept());
    await page.goto(`${process.env.BASE_URL}/user?page=3`);
    await expect(page.getByTestId("actions-dropdown")).not.toBeVisible();

    const checkboxes = page.locator('table button[role="checkbox"]');
    await checkboxes.nth(4).check();
    await checkboxes.last().check();

    await expect(page.getByTestId("actions-dropdown")).toBeVisible();
    await page.getByTestId("actions-dropdown").click();
    await expect(
      page.getByTestId("actions-dropdown-content").getByText("Delete")
    ).toBeVisible();

    const response = page.waitForResponse(
      (response) =>
        response.request().method() === "DELETE" && response.status() === 200
    );
    await page
      .getByTestId("actions-dropdown-content")
      .getByText("Delete")
      .click();
    await response;
    await expect(page.getByText("Deleted successfully")).toBeVisible();
    await expect(page.locator("table tbody tr")).toHaveCount(3);
  });
});
