import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

test('has title', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}/admin`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin/);
});

test('create user', async ({ page }) => {

  const testEmail = 'test+e2e@premieroctet.com';

  await page.goto(`${process.env.BASE_URL}/admin`);

  const prisma = new PrismaClient();
  const beforeUsers = await prisma.user.count();

  await page.click('a[href="/admin/user"]');
  await page.waitForURL(`${process.env.BASE_URL}/admin/user`);

  await page.click('a[href="/admin/user/new"]');
  await page.waitForURL(`${process.env.BASE_URL}/admin/user/new`);

  await page.fill('input[id="email"]', testEmail);

  await page.click('button:has-text("Submit")');

  await page.waitForURL(`${process.env.BASE_URL}/admin/user/*`);

  const afterUsers = await prisma.user.count();
  expect(afterUsers).toBe(beforeUsers + 1);

  await prisma.user.delete({
    where: {
      email: testEmail
    }
  });
});