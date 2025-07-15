import { createOptions } from "examples-common/options";

export const options = createOptions({
  getCategories: async () => {
    const { getCategories } = await import("~/nextadmin");
    return getCategories();
  },
  publishPosts: async (ids) => {
    const { publishPosts } = await import("~/nextadmin");
    return publishPosts(ids);
  },
});
