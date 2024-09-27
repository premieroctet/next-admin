import { globSync } from "glob";

export const getRouterRoot = (basePath: string) => {
  const pageRouterPath = globSync(["pages/", "src/pages/"], { cwd: basePath });

  if (pageRouterPath.length) {
    return { path: pageRouterPath[0], type: "page" };
  }

  const appRouterPath = globSync(["app/", "src/app/"], { cwd: basePath });

  if (appRouterPath.length) {
    return { path: appRouterPath[0], type: "app" };
  }

  return false;
};
