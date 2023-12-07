import { Page, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { ModelName } from "@premieroctet/next-admin";
import { models } from "./001-crud.spec";

export const prisma = new PrismaClient();

type DataTest = {
  [key in (typeof models)[number]]: {
    [key: string]: string;
  };
};

export const dataTest: DataTest = {
  User: {
    email: "my-user+e2e@premieroctet.com",
    name: "MY_USER",
  },
  Post: {
    title: "MY_POST",
    authorId: "User 0 (user0@nextadmin.io)",
  },
  Category: {
    name: "MY_CATEGORY",
  },
};

const dataTestUpdate: DataTest = {
  User: {
    email: "update-my-user+e2e@premieroctet.com",
    name: "UPDATE_MY_USER",
  },
  Post: {
    title: "UPDATE_MY_POST",
    authorId: "User 1 (user1@nextadmin.io)",
  },
  Category: {
    name: "UPDATE_MY_CATEGORY",
  },
};

export const createItem = async (
  model: ModelName,
  page: Page
): Promise<string> => {
  await page.goto(`${process.env.BASE_URL}/${model}`);
  await page.getByRole("button", { name: "Add" }).click();
  await page.waitForURL(`${process.env.BASE_URL}/${model}/new`);
  await fillForm(model, page, dataTest);
  await page.click('button:has-text("Submit")');
  await page.waitForURL((url) => !url.pathname.endsWith("/new"));
  const url = new URL(page.url());
  const id = url.pathname.split("/").pop();
  expect(Number(id)).not.toBeNaN();
  expect(page.getByText("Created successfully")).toBeDefined();
  return id!;
};

export const deleteItem = async (model: ModelName, page: Page, id: string) => {
  page.on("dialog", async (dialog) => dialog.accept());
  await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
  await page.click('button:has-text("Delete")');
  await page.waitForURL((url) =>
    url.pathname.endsWith(`/${model.toLowerCase()}`)
  );
};

export const readItem = async (model: ModelName, page: Page, id: string) => {
  await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
  await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
  await readForm(model, page, dataTest);
};

export const updateItem = async (model: ModelName, page: Page, id: string) => {
  await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
  await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
  await fillForm(model, page, dataTestUpdate);
  await page.click('button:has-text("Submit")');
  await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
  await readForm(model, page, dataTestUpdate);
  expect(page.getByText("Updated successfully")).toBeDefined();
};

export const fillForm = async (
  model: ModelName,
  page: Page,
  dataTest: DataTest
) => {
  switch (model) {
    case "User":
      await page.fill('input[id="email"]', dataTest.User.email);
      await page.fill('input[id="name"]', dataTest.User.name);
      await page.setInputFiles('input[type="file"]', {
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("test"),
      });
      break;
    case "Post":
      await page.fill('input[id="title"]', dataTest.Post.title);
      await page.getByLabel("authorId*").click();
      await page.getByText(dataTest.Post.authorId).click();
      break;
    case "Category":
      await page.fill('input[id="name"]', dataTest.Category.name);
      break;
    default:
      break;
  }
};

export const readForm = async (
  model: ModelName,
  page: Page,
  dataTest: DataTest
) => {
  switch (model) {
    case "User":
      expect(await page.inputValue('input[id="email"]')).toBe(
        dataTest.User.email
      );
      expect(await page.inputValue('input[id="name"]')).toBe(
        dataTest.User.name
      );
      expect(
        page.locator(
          'a[href="https://www.gravatar.com/avatar/00000000000000000000000000000000"]'
        )
      ).toBeDefined();
      break;
    case "Post":
      expect(await page.inputValue('input[id="title"]')).toBe(
        dataTest.Post.title
      );
      expect(await page.inputValue('input[id="authorId"]')).toBe(
        dataTest.Post.authorId
      );
      break;
    case "Category":
      expect(await page.inputValue('input[id="name"]')).toBe(
        dataTest.Category.name
      );
      break;
    default:
      break;
  }
};

const getRows = async (page: Page) => {
  const table = await page.$("table");
  const tbody = await table?.$("tbody");
  return await tbody?.$$("tr");
};

export const search = async (page: Page) => {
  await page.goto(`${process.env.BASE_URL}/User`);
  await page.fill('input[name="search"]', "user0@nextadmin.io");
  await page.waitForTimeout(600);
  const table = await page.$("table");
  const tbody = await table?.$("tbody");
  const rows = await tbody?.$$("tr");
  const oneRow = rows?.length === 1;
  expect(oneRow).toBeTruthy();
};

export const sort = async (page: Page) => {
  await page.goto(`${process.env.BASE_URL}/User`);
  await page.click('th:has-text("email")>button');
  await page.waitForTimeout(300);
  let rows = await getRows(page);
  let firstRow = await rows?.[0]?.innerText();
  expect(firstRow).toContain("user0@nextadmin.io");

  await page.click('th:has-text("email")>button');
  await page.waitForTimeout(300);
  rows = await getRows(page);
  firstRow = await rows?.[0]?.innerText();
  expect(firstRow).toContain("user9@nextadmin.io");
};

export const pagination = async (page: Page) => {
  await page.goto(`${process.env.BASE_URL}/User`);
  await paginationPerPage(page, 10);
};

export const paginationPerPage = async (page: Page, itemPerPage: number) => {
  const numberOfItems = 25;
  const numberOfPages = Math.ceil(numberOfItems / itemPerPage);
  for (let i = 1; i <= numberOfPages; i++) {
    await page.getByRole("button", { name: i.toString() }).click();
    await page.waitForTimeout(300);
    let rows = await getRows(page);
    if (i === numberOfPages) {
      expect(rows?.length).toBe(numberOfItems % itemPerPage);
    } else {
      expect(rows?.length).toBe(itemPerPage);
    }
  }
  await page.getByRole("button", { name: "1" }).click();
};
