import clsx from "clsx";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"input">;

const BaseInput = ({ className, ...props }: Props) => {
  return (
    <input
      className={twMerge(
        clsx(
          "dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-colors duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6",
          className
        )
      )}
      {...props}
    />
  );
};

export default BaseInput;
