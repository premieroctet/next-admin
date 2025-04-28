"use server";
import prisma from "database";
const addTag = async (tag, selectedIds) => {
    await prisma.post.updateMany({
        where: {
            id: {
                in: selectedIds,
            },
        },
        data: {
            tags: {
                push: tag,
            },
        },
    });
};
export default addTag;
