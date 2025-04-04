import React from "react";
import { UploadedFile } from "../types";

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

export const extractSerializable = <T>(obj: T, isAppDir?: boolean): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      extractSerializable(item, isAppDir)
    ) as unknown as T;
  } else if (obj === null) {
    return obj;
  } else if (typeof obj === "object") {
    if (isAppDir && React.isValidElement(obj)) {
      return obj;
    }
    let newObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj = {
          ...newObj,
          [key]: extractSerializable(obj[key], isAppDir),
        };
      }
    }
    return newObj;
  } else if (isScalar(obj)) {
    return obj;
  } else {
    return null as unknown as T;
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

export const isUploadFile = (obj: any): obj is UploadedFile => {
  return typeof obj === "object" && "buffer" in obj && "infos" in obj && obj.buffer.length > 0;
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

export const getDeletedFilesFieldName = (field: string) =>
  `${field}__nextadmin_deleted`;

export const isFileUploadFormat = (format: string) => {
  return ["data-url", "file"].includes(format);
};
