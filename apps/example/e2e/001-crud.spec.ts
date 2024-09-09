import { test } from "@playwright/test";
import {
  createItem,
  dataTest,
  deleteItem,
  readItem,
  updateItem,
} from "./utils";

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
  test(`user create server error`, async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/User/new`);
    await page.fill('input[id="name"]', dataTest.User.name);
    await page.fill('input[id="email"]', "invalidemail");
    if (await page.isVisible('input[name="newPassword"]')) {
      await page.fill('input[name="newPassword"]', dataTest.User.newPassword);
    }
    await page.click('button:has-text("Save and continue editing")');
    await page.waitForURL(`${process.env.BASE_URL}/User/new`);
    await test.expect(page.getByText("Invalid email")).toBeVisible();
  });

  test(`user create client error`, async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/User/new`);
    const nameRequired = page.locator('input[id="name"][required]');
    const validationMessage = await nameRequired.evaluate(
      (element) => (element as HTMLInputElement).validationMessage
    );
    test.expect(validationMessage).not.toBeNull();
  });
});
