import { createOptions } from "examples-common/options";

export const options = createOptions({
  getCategories: async () => {
    const { getCategories } = await import("~/nextadmin.server");
    return getCategories();
  },
  publishPosts: async (ids) => {
    const { publishPosts } = await import("~/nextadmin.server");
    return publishPosts(ids);
  },
});
