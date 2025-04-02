import { PropsWithChildren } from "react";
import { cn } from "../../utils/tools";

export const Group = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn("bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis border-nextadmin-border-default dark:border-dark-nextadmin-border-default rounded-lg border p-4 sm:p-8", className)}>
    {children}
  </div>
}
