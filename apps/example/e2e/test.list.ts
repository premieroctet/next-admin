import { test } from '@playwright/test';
import crudTest from './crud.spec';
import tableTest from './table.spec';

export const models = ['user', 'Post', 'Category'] as const

models.forEach((model) => {
    test.describe(`Table ${model}`, () => tableTest(model));
    test.describe(`CRUD ${model}`, () => crudTest(model));
});
