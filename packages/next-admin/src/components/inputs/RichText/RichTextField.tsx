import { ChangeEventHandler, useMemo } from "react";
import { Descendant, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import * as Icons from "../../../assets/icons/RichTextActions";
import { RichTextFormat } from "../../../types";
import { Button, EditorContainer, Separator, Toolbar } from "./components";
import { renderElement, renderLeaf, serialize, deserialize } from "./utils";

type RichTextFieldProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  readonly?: boolean;
  rawErrors?: string[];
  name: string;
  value: string;
  schema: {
    format?: string;
  };
};

const RichTextField = ({ schema, onChange, ...props }: RichTextFieldProps) => {
  const { value } = props;
  const format = schema?.format?.split("-")[1] as RichTextFormat;
  const deserializedValue = deserialize(value, format);
  let initialValue: Descendant[] = deserializedValue;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <input type="hidden" name={props.name} value={value} />
      <EditorContainer>
        <Toolbar>
          <Button format="bold" icon={<Icons.Bold />} title="Bold" />
          <Button format="italic" icon={<Icons.Italic />} title="Italic" />
          <Button
            format="underline"
            icon={<Icons.Underline />}
            title="Underline"
          />
          <Button
            format="strikethrough"
            icon={<Icons.Strikethrough />}
            title="Strikethrough"
          />
          <Button format="code" icon={<Icons.Code />} title="Code" />
          <Separator />
          <Button
            format="blockquote"
            icon={<Icons.Quote />}
            title="Blockquote"
          />
          <Button
            format="bulleted-list"
            icon={<Icons.BullettedList />}
            title="Bulleted list"
          />
          <Button
            format="numbered-list"
            icon={<Icons.NumberedList />}
            title="Numbered list"
          />
          <Separator />
          <Button
            format="heading-one"
            icon={<Icons.Heading level={1} />}
            title="Heading 1"
          />
          <Button
            format="heading-two"
            icon={<Icons.Heading level={2} />}
            title="Heading 2"
          />
          <Button
            format="heading-three"
            icon={<Icons.Heading level={3} />}
            title="Heading 3"
          />
        </Toolbar>
        <Editable
          spellCheck
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="border border-gray-300 p-3 rounded-b-md shadow-sm min-h-[200px]"
          autoFocus
        />
      </EditorContainer>
    </Slate>
  );
};

export default RichTextField;
