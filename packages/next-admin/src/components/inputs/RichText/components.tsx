import * as React from 'react'
import { PropsWithChildren, Ref } from 'react'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      style={{
        cursor: 'pointer',
        color: reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
            ? 'black'
            : '#ccc',
      }}
    />
  )
)

Button.displayName = 'Button'



export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div
        ref={ref}
        {...props}
        style={{
          padding: '5px 20px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            padding: '5px 20px',
            color: '#404040',
            borderTop: '2px solid #eeeeee',
            background: '#f8f8f8',
          }}
        >
          {`Slate's value as text`}
        </div>
        <div
          style={{
            color: '#404040',
            font: '12px monospace',
            whiteSpace: 'pre-wrap',
            padding: '10px 20px',
          }}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

EditorValue.displayName = 'EditorValue'

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      style={{
        fontSize: '18px',
        verticalAlign: 'text-bottom'
      }}
    />
  )
)

Icon.displayName = 'Icon'

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
    />
  )
)

Menu.displayName = 'Menu'

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
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

Toolbar.displayName = 'Toolbar'