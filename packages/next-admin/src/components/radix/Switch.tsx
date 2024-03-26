import * as Switch from "@radix-ui/react-switch";
import { ComponentProps, ElementRef, forwardRef } from "react";
import clsx from "clsx";

export const SwitchRoot = forwardRef<
  ElementRef<typeof Switch.Root>,
  Switch.SwitchProps
>(({ className, children, ...props }, ref) => {
  return (
    <Switch.Root
      className={clsx(
        "group relative inline-flex shrink-0 w-10 h-5 rounded-full cursor-pointer items-center justify-center focus:outline-none focus:ring-2 focus:ring-nextadmin-primary-600 focus:ring-offset-2",
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-full w-full rounded-md bg-white"
      />
      <span className="bg-gray-200 group-data-[state=checked]:bg-nextadmin-primary-500 pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out" />
      {children}
    </Switch.Root>
  );
});

export const SwitchThumb = forwardRef<
  ElementRef<typeof Switch.Thumb>,
  Switch.SwitchThumbProps
>(({ className, ...props }, ref) => {
  return (
    <Switch.Thumb
      className={clsx(
        "absolute left-0 inline-block w-5 h-5 bg-white border border-gray-200 ring-0 rounded-full shadow transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-5",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
