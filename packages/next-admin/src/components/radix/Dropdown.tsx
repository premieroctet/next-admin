import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { ComponentProps, ElementRef, forwardRef } from "react";
import clsx from "clsx";

export const Dropdown = DropdownMenu.Root;

export const DropdownTrigger = forwardRef<
  ElementRef<typeof DropdownMenu.Trigger>,
  ComponentProps<typeof DropdownMenu.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenu.Trigger
      className={clsx(
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </DropdownMenu.Trigger>
  );
});

DropdownTrigger.displayName = "DropdownTrigger";

export const DropdownBody = (
  props: ComponentProps<typeof DropdownMenu.Portal>
) => {
  return <DropdownMenu.Portal {...props} />;
};

DropdownBody.displayName = "DropdownBody";

export const DropdownContent = forwardRef<
  ElementRef<typeof DropdownMenu.Content>,
  ComponentProps<typeof DropdownMenu.Content>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu.Content
      className={clsx(
        "bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

DropdownContent.displayName = "DropdownContent";

export const DropdownItem = forwardRef<
  ElementRef<typeof DropdownMenu.Item>,
  ComponentProps<typeof DropdownMenu.Item>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu.Item
      className={clsx(
        "group text-sm text-gray-700 hover:bg-gray-100",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

DropdownItem.displayName = "DropdownItem";
