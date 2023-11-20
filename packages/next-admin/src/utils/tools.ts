export const capitalize = <T extends string>(str: T): Capitalize<T> => {
  let capitalizedStr = str.charAt(0).toLocaleUpperCase() + str.slice(1);
  return capitalizedStr as Capitalize<T>;
};

export const uncapitalize = <T extends string>(str: T): Uncapitalize<T> => {
  let uncapitalizedStr = str.charAt(0).toLocaleLowerCase() + str.slice(1);
  return uncapitalizedStr as Uncapitalize<T>;
};

export const isNativeFunction = (fn: Function) => {
  return /\{\s*\[native code\]\s*\}/.test(fn.toString());
};
