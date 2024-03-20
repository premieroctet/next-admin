import * as Tooltip from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import clsx from "clsx";

export const TooltipProvider = Tooltip.Provider;
export const TooltipRoot = Tooltip.Root;
export const TooltipTrigger = Tooltip.Trigger;
export const TooltipArrow = Tooltip.Arrow;
export const TooltipPortal = Tooltip.Portal;

export const TooltipContent = forwardRef<
  React.ElementRef<typeof Tooltip.Content>,
  Tooltip.TooltipContentProps
>(({ className, ...props }, ref) => {
  return (
    <Tooltip.Content
      {...props}
      className={clsx(
        "text-sm text-gray-500 border border-slate-100 bg-slate-50 shadow-xl rounded",
        className
      )}
      ref={ref}
    />
  );
});
