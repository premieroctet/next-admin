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

export const getBabelUsage = (basePath: string) => {
  const babelConfigPath = globSync(
    ["babel.config.{js,json}", ".babelrc", ".babelrc.{js,json}"],
    { cwd: basePath }
  );

  if (babelConfigPath.length) {
    return true;
  }

  return false;
};

export const getAppFilePath = (basePath: string) => {
  const appFilePath = globSync(
    ["src/pages/_app.{js,jsx,ts,tsx}", "pages/_app.{js,jsx,ts,tsx}"],
    { cwd: basePath }
  );

  if (appFilePath.length) {
    return appFilePath[0];
  }

  return false;
};
