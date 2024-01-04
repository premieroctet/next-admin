import { ChangeEventHandler, useMemo } from "react";
import {
  Descendant,
  createEditor
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { RichTextFormat } from "../../../types";

import { Bold, Code, Italic, Quote, Strikethrough, Underline } from '../../../assets/icons/RichTextActions';
import { Button, EditorContainer, Toolbar } from './components';
import { renderElement, renderLeaf } from "./utils";



type RichTextFieldProps = {
  onChange: ChangeEventHandler<HTMLInputElement>
  readonly?: boolean;
  rawErrors?: string[];
  name: string;
  value: string;
  schema: {
    format?: string;
  };
}
const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: 'A line of text in a paragraph.' }] }]

const RichTextField = ({ schema, ...props }: RichTextFieldProps) => {
  const format = schema?.format?.split('-')[1] as RichTextFormat

  const editor = useMemo(() => withHistory(withReact(createEditor())), [])


  const handleChange = (value: any) => {
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    )
    if (isAstChange) {
      const content = JSON.stringify(value)
      console.log('content', content)
    }
  }


  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <EditorContainer>
        <Toolbar>
          <Button format="bold" icon={<Bold />} />
          <Button format="italic" icon={<Italic />} />
          <Button format="underline" icon={<Underline />} />
          <Button format="code" icon={<Code />} />
          <Button format="strikethrough" icon={<Strikethrough />} />
          <Button format="blockquote" icon={<Quote />} />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className='border border-gray-300 p-2 rounded-b-md'
          autoFocus
        />
      </EditorContainer>
    </Slate>
  );
}

export default RichTextField;
