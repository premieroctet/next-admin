import isHotkey from 'is-hotkey';
import { ChangeEventHandler, useCallback, useMemo } from "react";
import {
  createEditor,
  Editor
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useSlate, withReact } from 'slate-react';
import { RichTextFormat } from "../../../types";

import { Toolbar, Button, Icon } from './components';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

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

const RichTextField = ({ schema, ...props }: RichTextFieldProps) => {
  const format = schema?.format?.split('-')[1] as RichTextFormat

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
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
    <Slate editor={editor} initialValue={[]} onChange={handleChange}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
      </Toolbar>
      <Editable 
      renderElement={renderElement}
        renderLeaf={renderLeaf}
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  );
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default RichTextField;
