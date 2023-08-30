import { Page, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { ModelName } from "@premieroctet/next-admin";
import { models } from "./crud.spec";

export const prisma = new PrismaClient();

type DataTest = {
    [key in typeof models[number]]: {
        [key: string]: string
    }
}

export const dataTest: DataTest = {
    user: {
        email: 'my-user+e2e@premieroctet.com',
        name: 'MY_USER',
    },
    Post: {
        title: 'MY_POST',
        authorId: 'User 0 (user0@nextadmin.io)',
    },
    Category: {
        name: 'MY_CATEGORY',
    },
}

const dataTestUpdate: DataTest = {
    user: {
        email: 'update-my-user+e2e@premieroctet.com',
        name: 'UPDATE_MY_USER',
    },
    Post: {
        title: 'UPDATE_MY_POST',
        authorId: 'User 1 (user1@nextadmin.io)',
    },
    Category: {
        name: 'UPDATE_MY_CATEGORY',
    },
}

export const createItem = async (model: ModelName, page: Page): Promise<string> => {
    await page.goto(`${process.env.BASE_URL}/${model}`);
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForURL(`${process.env.BASE_URL}/${model}/new`);
    await fillForm(model, page, dataTest);
    await page.click('button:has-text("Submit")');
    await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
    const url = page.url();
    const id = url.split('/').pop();
    expect(Number(id)).not.toBeNaN();
    return id!;
}

export const deleteItem = async (model: ModelName, page: Page, id: string) => {
    page.on('dialog', async dialog => dialog.accept());
    await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
    await page.click('button:has-text("Delete")');
    await page.waitForURL(`${process.env.BASE_URL}/${model}`);
}

export const readItem = async (model: ModelName, page: Page, id: string) => {
    await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
    await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
    await readForm(model, page, dataTest);
}

export const updateItem = async (model: ModelName, page: Page, id: string) => {
    await page.goto(`${process.env.BASE_URL}/${model}/${id}`);
    await page.waitForURL(`${process.env.BASE_URL}/${model}/*`)
    await fillForm(model, page, dataTestUpdate);
    await page.click('button:has-text("Submit")');
    await page.waitForURL(`${process.env.BASE_URL}/${model}/*`);
    await readForm(model, page, dataTestUpdate);

}


export const fillForm = async (model: ModelName, page: Page, dataTest: DataTest) => {
    switch (model) {
        case 'user':
            await page.fill('input[id="email"]', dataTest.user.email);
            await page.fill('input[id="name"]', dataTest.user.name);
            break;
        case 'Post':
            await page.fill('input[id="title"]', dataTest.Post.title);
            await page.getByLabel('authorId*').click();
            await page.getByText(dataTest.Post.authorId).click();
            break;
        case 'Category':
            await page.fill('input[id="name"]', dataTest.Category.name);
            break;
        default:
            break;
    }
}

export const readForm = async (model: ModelName, page: Page, dataTest: DataTest) => {
    switch (model) {
        case 'user':
            expect(await page.inputValue('input[id="email"]')).toBe(dataTest.user.email);
            expect(await page.inputValue('input[id="name"]')).toBe(dataTest.user.name);
            break;
        case 'Post':
            expect(await page.inputValue('input[id="title"]')).toBe(dataTest.Post.title);
            expect(await page.inputValue('input[id="authorId"]')).toBe(dataTest.Post.authorId);
            break;
        case 'Category':
            expect(await page.inputValue('input[id="name"]')).toBe(dataTest.Category.name);
            break;
        default:
            break;
    }
}

const getRows = async (page: Page) => {
    const table = await page.$('table');
    const tbody = await table?.$('tbody');
    return await tbody?.$$('tr');
}


export const search = async (page: Page) => {
    await page.goto(`${process.env.BASE_URL}/user`);
    await page.fill('input[name="search"]', 'user0@nextadmin.io');
    await page.waitForTimeout(300);
    await page.waitForResponse(`${process.env.BASE_DOMAIN}/_next/data/**`);
    const table = await page.$('table');
    const tbody = await table?.$('tbody');
    const rows = await tbody?.$$('tr');
    const oneRow = rows?.length === 1;
    expect(oneRow).toBeTruthy();
}

export const sort = async (page: Page) => {
    await page.goto(`${process.env.BASE_URL}/user`);
    await page.click('th:has-text("email")>button');
    let rows = await getRows(page);
    let firstRow = await rows?.[0]?.innerText();
    expect(firstRow).toContain('user0@nextadmin.io');

    await page.click('th:has-text("email")>button');
    rows = await getRows(page);
    firstRow = await rows?.[0]?.innerText();
    expect(firstRow).toContain('user9@nextadmin.io');
}

export const pagination = async (page: Page) => {
    await page.goto(`${process.env.BASE_URL}/user`);
    await paginationPerPage(page, 10);
}

export const paginationPerPage = async (page: Page, itemPerPage: number) => {
    const numberOfItems = 25;
    const numberOfPages = Math.ceil(numberOfItems / itemPerPage);
    for (let i = 1; i <= numberOfPages; i++) {
        await page.getByRole('button', { name: i.toString() }).click();
        await page.waitForResponse(`${process.env.BASE_DOMAIN}/_next/data/**`);
        let rows = await getRows(page);
        if (i === numberOfPages) {
            expect(rows?.length).toBe(numberOfItems % itemPerPage);
        } else {
            expect(rows?.length).toBe(itemPerPage);
        }
    }
    await page.getByRole('button', { name: '1' }).click();
}