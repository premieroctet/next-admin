import { createOptions } from "examples-common/options";

export const options = createOptions({
  getCategories: async () => {
    const { getCategories } = await import("./functions/nextadmin");
    return getCategories();
  },
  publishPosts: async (ids) => {
    const { publishPosts } = await import("./functions/nextadmin");
    await publishPosts({ data: ids });
  },
});
