import { Page, expect } from "@playwright/test";
import { ModelName } from "@premieroctet/next-admin";
import { PrismaClient } from "@prisma/client";
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
    newPassword: "newPassword",
  },
  Post: {
    title: "MY_POST",
    author: "User 0 (user0@nextadmin.io)",
    tag: "Tag test",
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
    author: "User 1 (user1@nextadmin.io)",
    tag: "Tag test",
  },
  Category: {
    name: "UPDATE_MY_CATEGORY",
  },
};

export const createItem = async (
  model: ModelName,
  page: Page
): Promise<string> => {
  await page.goto(`${process.env.BASE_URL}/${model.toLowerCase()}`);
  await page.getByTestId("add-new-button").click();
  await page.waitForURL(`${process.env.BASE_URL}/${model.toLowerCase()}/new`);

  await fillForm(model, page, dataTest);

  await page.click('button[name="save_edit"]');
  await page.waitForURL((url) => !url.pathname.endsWith("/new"));

  const url = new URL(page.url());
  const id = url.pathname.split("/").pop();

  expect(Number(id)).not.toBeNaN();
  expect(page.getByText("Created successfully")).toBeDefined();

  return id!;
};

export const deleteItem = async (model: ModelName, page: Page, id: string) => {
  page.on("dialog", async (dialog) => dialog.accept());
  await page.goto(`${process.env.BASE_URL}/${model.toLowerCase()}/${id}`);
  await page.click('button:has-text("Delete")');
  await page.waitForURL((url) =>
    url.pathname.endsWith(`/${model.toLowerCase()}`)
  );
};

export const readItem = async (model: ModelName, page: Page, id: string) => {
  await page.goto(`${process.env.BASE_URL}/${model.toLowerCase()}/${id}`);
  await page.waitForURL(`${process.env.BASE_URL}/${model.toLowerCase()}/*`);
  await readForm(model, page, dataTest);
};

export const updateItem = async (model: ModelName, page: Page, id: string) => {
  await page.goto(`${process.env.BASE_URL}/${model.toLowerCase()}/${id}`);
  await page.waitForURL(`${process.env.BASE_URL}/${model.toLowerCase()}/*`);
  await fillForm(model, page, dataTestUpdate);
  await page.click('button:has-text("Save and continue editing")');
  await page.waitForURL(`${process.env.BASE_URL}/${model.toLowerCase()}/*`);
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
      if (await page.isVisible('input[name="newPassword"]')) {
        await page.fill('input[name="newPassword"]', dataTest.User.newPassword);
      }
      await page.setInputFiles('input[type="file"]', {
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("test"),
      });
      break;
    case "Post": {
      await page.fill('input[id="title"]', dataTest.Post.title);
      await page.click('select[name="author"]');
      /* Search for relationship test */
      await page.fill(
        'input[id="author-search"]',
        dataTest.Post.author.slice(0, 6)
      );

      await page.waitForTimeout(2000);
      await page.getByText(dataTest.Post.author).click();

      const hasTags = await page.isVisible(
        'input[name="tags"] ~ li:first-of-type'
      );

      if (!hasTags) {
        await page.click('input[name="tags"] ~ button');
        await page.fill(
          'input[name="tags"] ~ li:first-of-type input',
          dataTest.Post.tag
        );
      }

      break;
    }
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
      expect(await page.innerText('span[id="author"]')).toBe(
        dataTest.Post.author
      );
      const tagInput = page.locator(
        "input[name='tags'] ~ li:first-of-type input"
      );
      expect(await tagInput.inputValue()).toBe(dataTest.Post.tag);
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

export const search = async (page: Page, model: ModelName, search: string) => {
  await page.goto(`${process.env.BASE_URL}/${model.toLowerCase()}`);
  await page.fill('input[name="search"]', search);
  await page.waitForURL((url) => {
    const search = url.searchParams.get("search");

    return !!search && search.includes(search);
  });
  const table = await page.$("table");
  const tbody = await table?.$("tbody");
  const rows = await tbody?.$$("tr");
  const oneRow = rows?.length === 1;
  expect(oneRow).toBeTruthy();
};

export const filter = async (page: Page) => {
  await page.goto(`${process.env.BASE_URL}/user`);
  await page.waitForURL(`${process.env.BASE_URL}/user`);
  let table = await page.$("table");
  let tbody = await table?.$("tbody");
  let rows = await tbody?.$$("tr");
  await page.click(`button[id="is Admin"]`); // Add `isAdmin` filter
  await page.waitForURL((url) => {
    const filters = url.searchParams.get("filters");
    return !!filters && filters.includes("is Admin");
  });
  table = await page.$("table");
  tbody = await table?.$("tbody");
  rows = await tbody?.$$("tr");
  const oneRow = rows?.length === 1;
  expect(oneRow).toBeTruthy();
  await page.click(`button[id="is Admin"]`); // Remove `is Admin` filter
};

export const sort = async (page: Page) => {
  await page.goto(`${process.env.BASE_URL}/user`);
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
  await page.goto(`${process.env.BASE_URL}/user`);
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

export const getFormData = async (page: Page) => {
  const form = await page.$("form");
  const formData = await form?.evaluate((form) => {
    const formData = new FormData(form);
    return Object.fromEntries(formData);
  });
  return formData;
};
