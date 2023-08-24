import { PrismaClient } from "@prisma/client";

export const TEST_EMAIL = 'test+e2e@premieroctet.com';

const prisma = new PrismaClient();

export const createTestUser = async (name?: string) => {
    const user = await prisma.user.create({
        data: {
            email: TEST_EMAIL,
            name: name || 'test',
            role: 'ADMIN',
        },
    })
    return user.id;
}


export const deleteTestUser = async () => {
    await prisma.user.deleteMany({
        where: {
            email: TEST_EMAIL,
        },
    });
}