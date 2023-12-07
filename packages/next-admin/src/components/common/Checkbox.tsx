import { HTMLProps, useEffect, useRef } from "react";

type Props = HTMLProps<HTMLInputElement> & { indeterminate?: boolean };

export const Checkbox = ({ indeterminate, ...props }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !props.checked && indeterminate;
    }
  }, [ref, indeterminate, props.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
      {...props}
    />
  );
};
