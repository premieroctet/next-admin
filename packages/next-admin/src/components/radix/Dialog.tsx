import * as Dialog from "@radix-ui/react-dialog";
import { ElementRef, forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogPortal = Dialog.Portal;

export const DialogOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  Dialog.DialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <Dialog.Overlay
      className={twMerge(
        clsx(
          "fixed inset-0 z-[51] bg-zinc-950/25 dark:bg-zinc-950/50",
          className
        )
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
      className={twMerge(
        clsx(
          "text-nextadmin-content-emphasis dark:text-dark-nextadmin-content-emphasis border-nextadmin-border-strong dark:border-dark-nextadmin-border-strong bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default fixed top-[50%] z-[52] w-full translate-y-[-50%] rounded-lg border bg-white p-6 shadow-lg md:left-[50%] md:w-[50vw] md:translate-x-[-50%]",
          className
        )
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
      className={twMerge(
        clsx(
          "text-nextadmin-content-default dark:text-dark-nextadmin-content-default text-lg",
          className
        )
      )}
      ref={ref}
      {...props}
    />
  );
});
