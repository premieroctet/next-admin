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
        "focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
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
        "bg-nextadmin-background-default dark:bg-dark-nextadmin-background-subtle z-50 rounded-md shadow-lg focus:outline-none focus:ring-0",
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
        "text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted hover:bg-nextadmin-background-muted group text-sm focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
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
      className={clsx("m-1 h-px bg-gray-200", className)}
      ref={ref}
      {...props}
    />
  );
});

DropdownSeparator.displayName = "DropdownSeparator";
