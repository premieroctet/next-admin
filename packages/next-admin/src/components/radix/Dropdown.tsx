import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { ComponentProps, ElementRef, forwardRef } from "react";

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
        "bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
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

export const DropdownLabel = forwardRef<
  ElementRef<typeof DropdownMenu.Label>,
  ComponentProps<typeof DropdownMenu.Label>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu.Label
      className={clsx("group text-sm font-medium text-gray-900", className)}
      ref={ref}
      {...props}
    />
  );
});

DropdownLabel.displayName = "DropdownLabel";

export const DropdownSeparator = forwardRef<
  ElementRef<typeof DropdownMenu.Separator>,
  ComponentProps<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu.Separator
      className={clsx("h-px bg-gray-200 m-1", className)}
      ref={ref}
      {...props}
    />
  );
});

DropdownSeparator.displayName = "DropdownSeparator";
