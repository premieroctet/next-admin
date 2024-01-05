import { BaseEditor, Editor, EditorMarks, Node, Text, Transforms } from "slate"
import { HistoryEditor } from "slate-history"
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react"
import { TypeElement } from "typescript"
import { RichTextFormat } from "../../../types"

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: {
      type: string
      children: Node[]
      textAlign?: string
    }
    Text: {
      text: string
      bold?: boolean
      italic?: boolean
      underline?: boolean
      code?: boolean
      strikethrough?: boolean
    },
  }
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export const isMark = (format: string): format is keyof EditorMarks => {
  return ['bold', 'italic', 'underline', 'code', 'strikethrough'].includes(format)
}

export const toggleMark = (editor: Editor, format: keyof EditorMarks) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const toggleBlock = (editor: Editor, format: any) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    // @ts-expect-error
    match: n => LIST_TYPES.includes(n.type as string),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const isMarkActive = (editor: Editor, format: keyof EditorMarks) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const isBlockActive = (editor: Editor, format: TypeElement) => {
  const [match] = Editor.nodes(editor, {
    // @ts-expect-error
    match: n => n.type === format,
  })

  return !!match
}

export const renderLeaf = (props: RenderLeafProps) => {
  let { children, leaf } = props
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.code) {
    children = <code
      style={{
        backgroundColor: '#eee',
        padding: '3px',
        borderRadius: '3px',
      }}
    >{children}</code>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }
  return <span {...props.attributes}>{children}</span>
}

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes} style={{
        listStyleType: 'disc',
        marginLeft: '1rem',
      }}>{children}</ul>
    case 'numbered-list':
      return <ol {...attributes}
        style={{
          listStyleType: 'decimal',
          marginLeft: '1rem',
        }}
      >{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'heading-one':
      return <h1 {...attributes}
        style={{
          fontSize: '2rem',
          fontWeight: 600,
        }}
      >{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
        }}
      >{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >{children}</h3>
    case 'blockquote':
      return <blockquote
        style={{
          borderLeft: '2px solid #ddd',
          paddingLeft: '1rem',
          marginLeft: '1rem',
        }}
      >{children}</blockquote>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export const serialize = (nodes: Node[], format: RichTextFormat) => {
  if (format === 'html') {
    return nodes.map(n => serializeHtml(n)).join('<br />')
  } else {
    return JSON.stringify(nodes)
  }
}

export const serializeHtml = (node: Node) => {
  if (Text.isText(node)) {
    let string = node.text
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    if (node.code) {
      string = `<code
      >${string}</code>`
    }
    if (node.italic) {
      string = `<em>${string}</em>`
    }
    if (node.underline) {
      string = `<u>${string}</u>`
    }
    if (node.strikethrough) {
      string = `<s>${string}</s>`
    }
    return `<span>${string}</span>`
  }

  const children: string = node.children.map(n => serializeHtml(n)).join('')

  // @ts-expect-error
  switch (node.type) {
    case 'bulleted-list':
      return `<ul>${children}</ul>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'heading-one':
      return `<h1>${children}</h1>`
    case 'heading-two':
      return `<h2>${children}</h2>`
    case 'heading-three':
      return `<h3>${children}</h3>`
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    default:
      return `<p>${children}</p>`
  }
}

export const deserialize = (string: string, format: RichTextFormat) => {
  if (format === 'html') {
    const dom = new DOMParser().parseFromString(string, 'text/html')
    return deserializeHtml(dom.body)
  } else {
    try {
      return JSON.parse(string)
    } catch {
      return [{ type: 'paragraph', children: [{ text: string }] }]
    }
  }
}

export const deserializeHtml = (el: HTMLElement, markAttributes: EditorMarks = {}) => {
  if (el.nodeType === 3) {
    return {
      text: el.textContent || '',
      ...markAttributes
    }
  }

  const nodeAttributes = { ...markAttributes } as EditorMarks

  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes['bold'] = true
      break
    case 'EM':
      nodeAttributes['italic'] = true
      break
    case 'U':
      nodeAttributes['underline'] = true
      break
    case 'S':
      nodeAttributes['strikethrough'] = true
      break
    case 'CODE':
      nodeAttributes['code'] = true
      break
  }

  const children: Node[] = Array.from(el.childNodes)
    .map(node => deserializeHtml(node as HTMLElement, nodeAttributes))
    .flat()

  switch (el.nodeName) {
    case 'P':
      return {
        type: 'paragraph',
        children
      }
    case 'BR':
      return children
    case 'H1':
      return {
        type: 'heading-one',
        children,
      }
    case 'H2':
      return {
        type: 'heading-two',
        children,
      }
    case 'H3':
      return {
        type: 'heading-three',
        children,
      }
    case 'BLOCKQUOTE':
      return {
        type: 'blockquote',
        children,
      }
    case 'UL':
      return {
        type: 'bulleted-list',
        children,
      }
    case 'OL':
      return {
        type: 'numbered-list',
        children,
      }
    case 'LI':
      return {
        type: 'list-item',
        children,
      }
    default:
      return children
  }

}