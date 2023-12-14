import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const inputVariants = cva(
  "px-3 py-2.5 gap-2 rounded-md text-sm border border-gray-200 placeholder:text-gray-400",
  {
    variants: {
      variant: {
        default:
          "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:outline-none",
        error: "border-red-500 ring-2 ring-red-100 focus-visible:outline-none",
      },
      withIcon: {
        true: "pl-10",
      },
    },
    defaultVariants: {
      variant: "default",
      withIcon: false,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, asChild = false, withIcon, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";
    return (
      <Comp
        className={clsx(inputVariants({ variant, withIcon, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
export default Input;
