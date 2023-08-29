import { test } from '@playwright/test';
import { ModelName } from '@premieroctet/next-admin';
import { searchInTable } from './utils';

const tests = (model: ModelName) => {
    test(`search ${model}`, async ({ page }) => {
        await searchInTable(model, page);
    });
}

export default tests;
