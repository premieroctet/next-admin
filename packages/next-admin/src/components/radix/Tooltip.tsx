import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { forwardRef, PropsWithChildren, useState } from "react";

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
        "border-nextadmin-border-default dark:border-dark-nextadmin-border-strong bg-nextadmin-background-subtle dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted rounded border text-sm shadow-xl",
        className
      )}
      ref={ref}
    />
  );
});

export const SimpleTooltip = ({
  children,
  text,
}: PropsWithChildren<{ text: string | React.ReactNode }>) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side="bottom"
            className="z-50 px-2 py-1 text-xs"
            sideOffset={4}
          >
            {showTooltip && text}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};
