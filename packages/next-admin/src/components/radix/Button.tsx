import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import Spinner from "../common/Spinner";

import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-nextadmin-brand-default text-nextadmin-brand-inverted hover:bg-nextadmin-brand-emphasis",
        destructive:
          "bg-red-600 dark:bg-red-400 text-nextadmin-brand-inverted dark:text-dark-nextadmin-brand-inverted hover:bg-red-700 dark:hover:bg-red-500",
        destructiveOutline:
          "text-red-600 dark:text-red-400 hover:bg-red-100 bg-transparent",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-neutral-700 text-white hover:bg-neutral-600",
        ghost:
          "hover:bg-nextadmin-brand-muted hover:text-nextadmin-content-emphasis dark:hover:bg-dark-nextadmin-brand-muted/20 dark:hover:text-dark-nextadmin-brand-inverted text-nextadmin-brand-color dark:text-dark-nextadmin-brand-muted",
        link: "underline-offset-4 hover:underline text-black",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
      icon: {
        true: "!px-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={loading || disabled}
        {...props}
        className={clsx(buttonVariants({ variant, size, className, icon }))}
      >
        {loading && <Spinner className="mr-2 inline h-4 w-4" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
