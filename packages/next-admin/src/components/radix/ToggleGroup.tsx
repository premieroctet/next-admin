import * as ToggleGroup from "@radix-ui/react-toggle-group";
import clsx from "clsx";
import { ComponentProps, ComponentRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const ToggleGroupRoot = forwardRef<
  ComponentRef<typeof ToggleGroup.Root>,
  ComponentProps<typeof ToggleGroup.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroup.Root
    {...props}
    className={twMerge(
      clsx(
        "border-nextadmin-border-default dark:border-dark-nextadmin-border-default inline-flex space-x-px overflow-hidden rounded-md border",
        className
      )
    )}
    ref={ref}
  />
));

export const ToggleGroupItem = forwardRef<
  ComponentRef<typeof ToggleGroup.Item>,
  ToggleGroup.ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <ToggleGroup.Item
    {...props}
    className={twMerge(
      clsx(
        "bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis px-4 py-2",
        "data-[state=on]:bg-nextadmin-background-emphasis data-[state=on]:text-nextadmin-text-emphasis",
        "dark:data-[state=on]:text-dark-nextadmin-text-emphasis dark:data-[state=on]:bg-dark-nextadmin-background-default",
        className
      )
    )}
    ref={ref}
  />
));
