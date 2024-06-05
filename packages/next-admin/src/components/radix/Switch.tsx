import * as Switch from "@radix-ui/react-switch";
import clsx from "clsx";
import { ElementRef, forwardRef } from "react";

export const SwitchRoot = forwardRef<
  ElementRef<typeof Switch.Root>,
  Switch.SwitchProps
>(({ className, children, ...props }, ref) => {
  return (
    <Switch.Root
      className={clsx(
        "group relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-full w-full bg-transparent"
      />
      <span className="bg-nextadmin-background-muted dark:bg-dark-nextadmin-background-muted group-data-[state=checked]:bg-nextadmin-brand-subtle dark:group-data-[state=checked]:bg-dark-nextadmin-brand-subtle pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out" />
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
        "border-nextadmin-border-default absolute left-0 inline-block h-5 w-5 translate-x-0.5 rounded-full border bg-white shadow ring-0 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5",
        "data-[disabled]:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
