import * as React from "react";

export const getClonableElement = <T extends unknown>(
  element: React.ReactElement<T>
): React.ReactElement<T> => {
  // @ts-expect-error
  if (React.use && element.$$typeof === Symbol.for("react.lazy")) {
    // @ts-expect-error
    return React.use(element._payload);
  }

  return element;
};
