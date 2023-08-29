import { test } from '@playwright/test';
import { createItem, deleteItem, readItem, updateItem } from './utils';
import { ModelName } from '@premieroctet/next-admin';

const tests = (model: ModelName) => {

  test.describe.configure({ mode: 'serial' });
  let id: string;

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
}

export default tests;
