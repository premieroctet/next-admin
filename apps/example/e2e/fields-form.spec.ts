import { test } from "@playwright/test";
import { dataTest, fillForm, getFormData } from "./utils";

export const models = ["User", "Post", "Category"] as const;

test.describe("Post form submission", () => {
  test("should create a new post and check formData", async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/Post/new`);
    await fillForm("Post", page, dataTest);
    await page.click('button[id="published"]');

    const formData = await getFormData(page);

    test.expect(formData?.published).toBe("on");

    await page.click('button[id="published"]');
    const formData2 = await getFormData(page);
    test.expect(formData2?.published).toBe("off");
  });
});
