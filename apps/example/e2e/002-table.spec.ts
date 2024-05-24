import { test } from "@playwright/test";
import { filter, pagination, search, sort } from "./utils";

test.describe.serial("table test", () => {
  test(`search`, async ({ page }) => {
    await search(page, "User", "user0@nextadmin.io");
    await search(page, "Category", "Science");
  });

  test(`sort (on user)`, async ({ page }) => {
    await sort(page);
  });

  test(`filter (on user)`, async ({ page }) => {
    await filter(page);
  });

  test(`pagination (on user)`, async ({ page }) => {
    await pagination(page);
  });
});
