import { test } from '@playwright/test';
import { createItem, deleteItem, readItem, updateItem } from './utils';

export const models = ['user', 'Post', 'Category'] as const


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

