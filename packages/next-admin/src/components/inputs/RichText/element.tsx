import * as React from "react";

interface ElementProps {
  attributes: any;
  children: React.ReactNode;
  element: any;
}

// How components are rendered in the editor
export const Element: React.FC<ElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const style = {
    textAlign: element.align,
  };
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};