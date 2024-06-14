import clsx from "clsx";
import { ChangeEventHandler, useMemo } from "react";
import { Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import * as Icons from "../../../assets/icons/RichTextActions";
import { RichTextFormat } from "../../../types";
import { Button, EditorContainer, Separator, Toolbar } from "./components";
import {
  DEFAULT_HTML_VALUE,
  DEFAULT_JSON_VALUE,
  deserialize,
  renderElement,
  renderLeaf,
  serialize,
} from "./utils";

type RichTextFieldProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  readonly?: boolean;
  rawErrors?: string[];
  name: string;
  value: string;
  schema: {
    format?: string;
  };
  disabled?: boolean;
  required?: boolean;
};

const RichTextField = ({
  schema,
  onChange,
  disabled,
  required,
  ...props
}: RichTextFieldProps) => {
  const { value } = props;
  const format = schema?.format?.split("-")[1] as RichTextFormat;
  const deserializedValue = deserialize(value, format);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  let initialValue: Descendant[] = deserializedValue;

  const handleChange = (value: any) => {
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (isAstChange) {
      const serializedValue = serialize(value, format);
      // @ts-expect-error
      onChange?.({ target: { value: serializedValue } });
    }
  };

  const inputValue = useMemo(() => {
    if (required) {
      if (format === "html" && value === DEFAULT_HTML_VALUE) {
        return "";
      }

      try {
        if (format === "json" && value === JSON.stringify(DEFAULT_JSON_VALUE)) {
          return "";
        }
      } catch {
        return value;
      }
    }
    return value ?? "";
  }, [value]);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <div className="relative">
        <input
          name={props.name}
          value={inputValue}
          className="absolute inset-0 -z-10 h-full w-full opacity-0"
          required={required}
          readOnly
        />
        <EditorContainer>
          <Toolbar>
            <Button
              format="bold"
              icon={<Icons.Bold />}
              title="Bold"
              disabled={disabled}
            />
            <Button
              format="italic"
              icon={<Icons.Italic />}
              title="Italic"
              disabled={disabled}
            />
            <Button
              format="underline"
              icon={<Icons.Underline />}
              title="Underline"
              disabled={disabled}
            />
            <Button
              format="strikethrough"
              icon={<Icons.Strikethrough />}
              title="Strikethrough"
              disabled={disabled}
            />
            <Button
              format="code"
              icon={<Icons.Code />}
              title="Code"
              disabled={disabled}
            />
            <Separator />
            <Button
              format="blockquote"
              icon={<Icons.Quote />}
              title="Blockquote"
              disabled={disabled}
            />
            <Button
              format="bulleted-list"
              icon={<Icons.BullettedList />}
              title="Bulleted list"
              disabled={disabled}
            />
            <Button
              format="numbered-list"
              icon={<Icons.NumberedList />}
              title="Numbered list"
              disabled={disabled}
            />
            <Separator />
            <Button
              format="heading-one"
              icon={<Icons.Heading level={1} />}
              title="Heading 1"
              disabled={disabled}
            />
            <Button
              format="heading-two"
              icon={<Icons.Heading level={2} />}
              title="Heading 2"
              disabled={disabled}
            />
            <Button
              format="heading-three"
              icon={<Icons.Heading level={3} />}
              title="Heading 3"
              disabled={disabled}
            />
          </Toolbar>
          <Editable
            spellCheck
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly={disabled}
            className={clsx(
              "border-nextadmin-border-default dark:border-dark-nextadmin-border-default bg-nextadmin-background-default text-nextadmin-content-inverted",
              "ring-nextadmin-border-default",
              "focus:ring-nextadmin-brand-default",
              "dark:focus:ring-dark-nextadmin-brand-default",
              "dark:ring-dark-nextadmin-border-strong",
              "dark:text-dark-nextadmin-content-inverted",
              "dark:bg-dark-nextadmin-background-subtle min-h-[150px] rounded-bl-md p-3 shadow-sm ring-1 focus:ring-2 focus-visible:outline-none",
              {
                "cursor-not-allowed opacity-50": disabled,
              },
              "h-[150px] overflow-y-auto",
              "resize-y"
            )}
          />
        </EditorContainer>
      </div>
    </Slate>
  );
};

export default RichTextField;
