import * as Dialog from "@radix-ui/react-dialog";
import { ElementRef, ForwardedRef, forwardRef } from "react";
import clsx from "clsx";

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogPortal = Dialog.Portal;

export const DialogOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  Dialog.DialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <Dialog.Overlay
      className={clsx(
        "fixed inset-0 z-[51] bg-black/20 dark:bg-white/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const DialogContent = forwardRef<
  ElementRef<typeof Dialog.Content>,
  Dialog.DialogContentProps
>(({ className, ...props }, ref) => {
  return (
    <Dialog.Content
      className={clsx(
        "text-nextadmin-content-emphasis dark:text-dark-nextadmin-content-emphasis border-nextadmin-border-strong dark:border-dark-nextadmin-border-strong bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default fixed top-[50%] z-[52] w-full translate-y-[-50%] rounded-md border p-4 md:left-[50%] md:w-[50vw] md:translate-x-[-50%]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const DialogClose = Dialog.Close;

export const DialogTitle = forwardRef<
  ElementRef<typeof Dialog.Title>,
  Dialog.DialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <Dialog.Title
      className={clsx(
        "text-nextadmin-content-default dark:text-dark-nextadmin-content-default text-lg font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
