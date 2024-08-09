import React from "react";
import { UploadParameters } from "../types";

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

export const formatLabel = (label: string) => {
  let spacedLabel = label
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();

  return capitalize(spacedLabel.toLowerCase());
};

//Create a function that check if object satifies UploadParameters
export const isUploadParameters = (obj: any): obj is UploadParameters => {
  return (
    obj?.length === 2 &&
    Buffer.isBuffer(obj[0]) &&
    typeof obj[1] === "object" &&
    "name" in obj[1] &&
    "type" in obj[1]
  );
};

export const getDisplayedValue = (
  element: React.ReactElement<any> | string
): string => {
  if (typeof element === "string") {
    return element;
  } else if (React.isValidElement(element)) {
    return Array.prototype.map
      .call(
        (element.props as any).children,
        (child: React.ReactElement<any> | string) => getDisplayedValue(child)
      )
      .join("");
  } else {
    return "";
  }
};
