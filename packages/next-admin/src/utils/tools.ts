import { ModelName } from "../types";

export const capitalize = <T extends string>(str: T): Capitalize<T> => {
  let capitalizedStr = str.charAt(0).toLocaleUpperCase() + str.slice(1);
  return capitalizedStr as Capitalize<T>;
};

export const uncapitalize = <T extends string>(str: T): Uncapitalize<T> => {
  let uncapitalizedStr = str.charAt(0).toLocaleLowerCase() + str.slice(1);
  return uncapitalizedStr as Uncapitalize<T>;
};

export const flatCamelCase = (str: string) => {
  let flatCamelCaseStr = str.replace(/([A-Z])/g, " $1");
  return flatCamelCaseStr;
};

export const formatCamelCase = (str: string) => {
  let formatCamelCaseStr = capitalize(flatCamelCase(str));
  return formatCamelCaseStr;
};

export const ressourceToUrl = (ressource: ModelName): string => {
  return ressource.replace(/([A-Z])/g, "-$1").toLowerCase();
};

export const urlToRessource = (url: string): ModelName => {
  return url.replace(/-([a-z])/g, (group) => {
    return group[1].toUpperCase();
  }) as ModelName;
};

export const isNativeFunction = (fn: Function) => {
  return (/\{\s*\[native code\]\s*\}/).test(fn.toString())
}