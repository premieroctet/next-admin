import { BaseEditor, Editor, EditorMarks, Node, Text, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { TypeElement } from "typescript";
import { RichTextFormat } from "../../../types";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: {
      type: string;
      children: Node[];
      textAlign?: string;
    };
    Text: {
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
      strikethrough?: boolean;
    };
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const isMark = (format: string): format is keyof EditorMarks => {
  return ["bold", "italic", "underline", "code", "strikethrough"].includes(
    format
  );
};

export const toggleMark = (editor: Editor, format: keyof EditorMarks) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const toggleBlock = (editor: Editor, format: any) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    // @ts-expect-error
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const isMarkActive = (editor: Editor, format: keyof EditorMarks) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor: Editor, format: TypeElement) => {
  const [match] = Editor.nodes(editor, {
    // @ts-expect-error
    match: (n) => n.type === format,
  });

  return !!match;
};

export const renderLeaf = (props: RenderLeafProps) => {
  let { children, leaf } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = (
      <code
        style={{
          backgroundColor: "#eee",
          padding: "3px",
          borderRadius: "3px",
        }}
      >
        {children}
      </code>
    );
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  return <span {...props.attributes}>{children}</span>;
};

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul
          {...attributes}
          style={{
            listStyleType: "disc",
            marginLeft: "1rem",
          }}
        >
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol
          {...attributes}
          style={{
            listStyleType: "decimal",
            marginLeft: "1rem",
          }}
        >
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "heading-one":
      return (
        <h1
          {...attributes}
          style={{
            fontSize: "2rem",
            fontWeight: 600,
          }}
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          {...attributes}
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3
          {...attributes}
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          {children}
        </h3>
      );
    case "blockquote":
      return (
        <blockquote
          style={{
            borderLeft: "2px solid #ddd",
            paddingLeft: "1rem",
            marginLeft: "1rem",
          }}
        >
          {children}
        </blockquote>
      );
    case "br":
      return <>{children}</>;
    case "pargraph":
      return <p {...attributes}>{children}</p>;
    case "div":
      return <div {...attributes}>{children}</div>;
    default:
      return <>{children}</>;
  }
};

export const serialize = (nodes: Node[], format: RichTextFormat) => {
  if (format === "html") {
    return nodes.map((n) => serializeHtml(n)).join("");
  } else {
    return JSON.stringify(nodes);
  }
};

export const serializeHtml = (node: Node) => {
  if (Text.isText(node)) {
    let string = node.text;
    if (!string) {
      return `<br />`;
    }

    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.code) {
      string = `<code
      >${string}</code>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.strikethrough) {
      string = `<s>${string}</s>`;
    }
    return string;
  }

  const children: string = node.children.map((n) => serializeHtml(n)).join("");

  if (children === "<br />") {
    return children;
  }

  // @ts-expect-error
  switch (node.type) {
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "heading-three":
      return `<h3>${children}</h3>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    default:
      return `<div>${children}</div>`;
  }
};

const ensureRootNodeIsNotTextContent = (el: HTMLElement) => {
  const firstRootElement = el.firstChild;

  if (firstRootElement?.nodeType === 3) {
    const content = firstRootElement.textContent;
    const lineReturnRegex = new RegExp("\\n", "gi");
    const lineReturnCount = content?.match(lineReturnRegex)?.length ?? 0;

    const newRootNode = document.createElement("p");
    newRootNode.textContent = content?.replace(/\\n/gi, "") ?? "";

    el.firstChild?.remove();

    for (let i = 0; i < lineReturnCount; i++) {
      const lineBreakNode = document.createElement("br");
      el.prepend(lineBreakNode);
    }
    el.prepend(newRootNode);
  }

  return el;
};

export const DEFAULT_HTML_VALUE = "<br />";

export const DEFAULT_JSON_VALUE = [
  { type: "paragraph", children: [{ text: "" }] },
];

export const setDefaultValue = (s: string) => [
  { type: "paragraph", children: [{ text: s }] },
];

export const deserialize = (
  string: string | undefined | null,
  format: RichTextFormat
) => {
  if (!string) {
    return DEFAULT_JSON_VALUE;
  }

  if (format === "html") {
    if (typeof window === "undefined") {
      return DEFAULT_HTML_VALUE;
    }
    const html = string.replace(/>\s+</g, "><");
    const dom = new DOMParser().parseFromString(html, "text/html");
    return deserializeHtml(ensureRootNodeIsNotTextContent(dom.body));
  } else {
    try {
      return JSON.parse(string);
    } catch {
      return setDefaultValue(string);
    }
  }
};

export const deserializeHtml = (
  el: HTMLElement,
  markAttributes: EditorMarks = {}
) => {
  if (el.nodeType === 3) {
    return {
      text: el.textContent || "",
      ...markAttributes,
    };
  }

  const nodeAttributes = { ...markAttributes } as EditorMarks;

  switch (el.nodeName) {
    case "STRONG":
      nodeAttributes["bold"] = true;
      break;
    case "EM":
      nodeAttributes["italic"] = true;
      break;
    case "U":
      nodeAttributes["underline"] = true;
      break;
    case "S":
      nodeAttributes["strikethrough"] = true;
      break;
    case "CODE":
      nodeAttributes["code"] = true;
      break;
  }

  let children: Node[] = Array.from(el.childNodes)
    .map((node) => deserializeHtml(node as HTMLElement, nodeAttributes))
    .flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  switch (el.nodeName) {
    case "P":
      return {
        type: "paragraph",
        children,
      };
    case "BR": {
      return {
        type: "br",
        children,
      };
    }
    case "H1":
      return {
        type: "heading-one",
        children,
      };
    case "H2":
      return {
        type: "heading-two",
        children,
      };
    case "H3":
      return {
        type: "heading-three",
        children,
      };
    case "BLOCKQUOTE":
      return {
        type: "blockquote",
        children,
      };
    case "UL":
      return {
        type: "bulleted-list",
        children,
      };
    case "OL":
      return {
        type: "numbered-list",
        children,
      };
    case "LI":
      return {
        type: "list-item",
        children,
      };
    case "DIV":
      return {
        type: "div",
        children,
      };
    default:
      return children;
  }
};
