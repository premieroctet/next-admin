import clsx from 'clsx'
import * as React from 'react'
import { PropsWithChildren } from 'react'
import { useSlate } from 'slate-react'
import { isBlockActive, isMarkActive, toggleBlock, toggleMark, TypeElement } from './utils'
import { EditorMarks } from 'slate'
import { isTypeElement } from 'typescript'


interface BaseProps {
  className: string
  [key: string]: unknown
}

type ButtonProps = PropsWithChildren<{
  format: keyof EditorMarks,
  icon: React.ReactElement,
  title?: string,
} & BaseProps>
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, format, icon, ...props }, ref) => {

    // chekc if format is a mark or a block by checking if it is a keyof EditorMarks
    const isMark = isTypeElement(format)
    const editor = useSlate()
    const active = isMark ? isMarkActive(editor, format) : isBlockActive(editor, format)
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      if (isMark) {
        toggleMark(editor, format)
      } else {
        toggleBlock(editor, format)
      }
    }
    return (
      <button
        {...props}
        ref={ref}
        className={clsx(
          'pointer focus:outline-none focus:shadow-outline',
          className,
          {
            'bg-gray-200 hover:bg-gray-200 focus:bg-gray-200': active,
            'bg-white hover:bg-gray-100 focus:bg-gray-100': !active
          })}
        onMouseDown={handleMouseDown}
        onClick={event => event.preventDefault()}
      >
        {icon}
      </button>
    )
  }
)

export const EditorContainer = React.forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
})

// type MenuButtonProps = PropsWithChildren<{
//   value: any
// } & BaseProps>
// export const EditorValue = React.forwardRef<HTMLDivElement, MenuButtonProps>(
//   ({ className, value, ...props }, ref) => {
//     const textLines = value.document.nodes
//       .map(node => node.text)
//       .toArray()
//       .join('\n')
//     return (
//       <div
//         ref={ref}
//         {...props}
//         style={{
//           padding: '5px 20px',
//         }}
//       >
//         <div className='text-'
//           style={{
//             fontSize: '14px',
//             padding: '5px 20px',
//             color: '#404040',
//             borderTop: '2px solid #eeeeee',
//             background: '#f8f8f8',
//           }}
//         >
//           {`Slate's value as text`}
//         </div>
//         <div
//           style={{
//             color: '#404040',
//             font: '12px monospace',
//             whiteSpace: 'pre-wrap',
//             padding: '10px 20px',
//           }}
//         >
//           {textLines}
//         </div>
//       </div>
//     )
//   }
// )

type MenuProps = PropsWithChildren<BaseProps>
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
    />
  )
)

type ToolbarProps = PropsWithChildren<BaseProps>
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => (
    <Menu
      {...props}
      ref={ref}
      style={{
        position: 'relative',
        padding: '1px 18px 17px',
        margin: '0 -20px',
        borderBottom: '2px solid #eee',
        marginBottom: '20px',
      }}
    />
  )
)