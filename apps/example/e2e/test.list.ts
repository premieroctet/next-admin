import { test } from '@playwright/test';
import tableTest from './table.spec';
import crudTest from './crud.spec';

test.describe('Table User', tableTest);
test.describe('CRUD User', crudTest);