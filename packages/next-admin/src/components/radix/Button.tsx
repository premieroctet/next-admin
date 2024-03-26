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
          "bg-nextadmin-primary-600 text-white hover:bg-nextadmin-primary-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        destructiveOutline: "text-red-600 hover:bg-red-100 bg-transparent",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-neutral-700 text-white hover:bg-neutral-600",
        ghost:
          "hover:bg-nextadmin-primary-100 hover:text-nextadmin-primary-700 text-nextadmin-primary-700",
        link: "underline-offset-4 hover:underline text-black",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
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
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Spinner className="inline w-4 h-4 mr-2" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
