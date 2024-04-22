import clsx from "clsx";
import * as React from "react";
import { PropsWithChildren } from "react";
import { useSlate } from "slate-react";
import { TypeElement } from "typescript";
import {
  isBlockActive,
  isMark,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from "./utils";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

type ButtonProps = PropsWithChildren<
  {
    format: any;
    icon: React.ReactElement;
    title?: string;
  } & BaseProps
>;
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, format, icon, ...props }, ref) => {
    const editor = useSlate();

    let active: boolean;
    let handleMouseDown: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;

    if (isMark(format)) {
      active = isMarkActive(editor, format);
      handleMouseDown = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        event.preventDefault();
        toggleMark(editor, format);
      };
    } else {
      active = isBlockActive(editor, format as TypeElement);
      handleMouseDown = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        event.preventDefault();
        toggleBlock(editor, format);
      };
    }
    return (
      <button
        {...props}
        ref={ref}
        className={clsx(
          "pointer focus:ring-nextadmin-border-default dark:focus:ring-dark-nextadmin-border-strong rounded-md p-1.5 focus:outline-none focus:ring-2",
          {
            "bg-nextadmin-background-emphasis hover:bg-nextadmin-background-muted focus:bg-nextadmin-background-muted dark:bg-dark-nextadmin-background-subtle dark:hover:bg-dark-nextadmin-background-muted dark:focus:bg-dark-nextadmin-background-muted":
              active,
            "bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default hover:bg-gray-100 focus:bg-gray-100":
              !active,
          },
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onMouseDown={handleMouseDown}
        onClick={(event) => event.preventDefault()}
      >
        {React.cloneElement(icon, {
          className:
            "fill-nextadmin-content-emphasis dark:fill-dark-nextadmin-content-emphasis",
        })}
      </button>
    );
  }
);

export const EditorContainer = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

export const Separator = React.forwardRef<HTMLDivElement, BaseProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={clsx(
        "border-nextadmin-border-default dark:border-dark-nextadmin-border-default my-1 rounded-md border-x-[0.5px]",
        className
      )}
    />
  )
);

type ToolbarProps = PropsWithChildren<BaseProps>;
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-test-id="menu"
      className={clsx(
        //on last child remove border right
        "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong  !last:border-r-0 flex flex-row gap-1 rounded-t-md border-b-0 p-1.5 ring-1",
        className
      )}
    />
  )
);
