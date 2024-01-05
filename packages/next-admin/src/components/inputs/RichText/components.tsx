import clsx from 'clsx'
import * as React from 'react'
import { PropsWithChildren } from 'react'
import { useSlate } from 'slate-react'
import { TypeElement } from 'typescript'
import { isBlockActive, isMark, isMarkActive, toggleBlock, toggleMark } from './utils'


interface BaseProps {
  className: string
  [key: string]: unknown
}

type ButtonProps = PropsWithChildren<{
  format: any,
  icon: React.ReactElement,
  title?: string,
} & BaseProps>
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, format, icon, ...props }, ref) => {
    const editor = useSlate()
    let active: boolean
    let handleMouseDown: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void

    if (isMark(format)) {
      active = isMarkActive(editor, format)
      handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        toggleMark(editor, format)
      }
    } else {
      active = isBlockActive(editor, format as TypeElement)
      handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }
    }
    return (
      <button
        {...props}
        ref={ref}
        className={clsx(
          'pointer focus:outline-none focus:shadow-outline p-1.5 rounded-md',
          {
            'bg-gray-200 hover:bg-gray-200 focus:bg-gray-200': active,
            'bg-white hover:bg-gray-100 focus:bg-gray-100': !active
          },
          className)}
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



export const Separator = React.forwardRef<HTMLDivElement, BaseProps>(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={clsx(
      ' border-gray-300 my-1 border-x-[0.5px] rounded-md',
      className
    )}
  />
))

type ToolbarProps = PropsWithChildren<BaseProps>
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-test-id="menu"
      className={clsx(
        //on last child remove border right
        'flex flex-row gap-1 border-b-0 border-gray-300 border p-1.5 rounded-t-md !last:border-r-0',
        className
      )}
    />
  )
)