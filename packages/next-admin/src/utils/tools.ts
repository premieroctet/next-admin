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

export const isScalar = (value: string | boolean | number) => {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  );
};

export const pipe = <T>(...fns: Function[]) => (x: T) => {
  return fns.reduce(async (v, f) => {
    return await f(await v)
  }, Promise.resolve(x));
}

export const extract = <T>(obj: T, prototype: Partial<T>): T => {
  let newObj: any = {};
  for (const key in prototype) {
    if (key === '') {
      newObj = obj ? Object.keys(obj as object).reduce((acc, key) => {
        // @ts-expect-error
        acc[key] = extract(obj[key], prototype[String.prototype.valueOf()]!);
        return acc
      }, {} as any) : {};
    } else if (typeof prototype[key] === "object") {
      newObj[key] = extract(obj[key], prototype[key]!);
    } else if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj
};