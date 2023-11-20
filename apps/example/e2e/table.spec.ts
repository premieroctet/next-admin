import { test } from "@playwright/test";
import { pagination, search, sort } from "./utils";

test.describe.serial("table test", () => {
  test(`search (on user)`, async ({ page }) => {
    await search(page);
  });

  test(`sort (on user)`, async ({ page }) => {
    await sort(page);
  });

  test(`pagination (on user)`, async ({ page }) => {
    await pagination(page);
  });
});
