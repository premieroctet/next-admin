import { test } from "@playwright/test";
import { createItem, deleteItem, readItem, updateItem } from "./utils";

export const models = ["User", "Post", "Category"] as const;

models.forEach((model) => {
  let id: string;

  test.describe.serial(`crud ${model}`, () => {
    test(`create ${model}`, async ({ page }) => {
      id = await createItem(model, page);
    });

    test(`read ${model}`, async ({ page }) => {
      await readItem(model, page, id);
    });

    test(`update ${model}`, async ({ page }) => {
      await updateItem(model, page, id);
    });

    test(`delete ${model}`, async ({ page }) => {
      await deleteItem(model, page, id);
    });
  });
});

test.describe("user validation", () => {
  test(`user create error`, async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/User/new`);
    await page.fill('input[id="email"]', "user@nextadmin.io");
    await page.fill('input[id="name"]', "us");
    await page.click('button:has-text("Submit")');
    await page.waitForURL(`${process.env.BASE_URL}/User/*`);
    await test
      .expect(page.getByText("Name must be at least 3 characters long"))
      .toBeVisible();
  });
});
