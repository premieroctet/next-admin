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

export const isScalar = (value: any): value is string | boolean | number => {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  );
};

export const pipe =
  <T>(...fns: Function[]) =>
  (x: T) => {
    return fns.reduce(async (v, f) => {
      return await f(await v);
    }, Promise.resolve(x));
  };

export const extractSerializable = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(extractSerializable) as unknown as T;
  } else if (obj === null) {
    return obj;
  } else if (typeof obj === "object") {
    let newObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj = {
          ...newObj,
          [key]: extractSerializable(obj[key]),
        };
      }
    }
    return newObj;
  } else if (isScalar(obj)) {
    return obj;
  } else {
    return undefined as unknown as T;
  }
};

export const slugify = (str: string) => {
  return str.toLowerCase();
};
