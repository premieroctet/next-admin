import { ComponentProps, useMemo } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { MinusIcon, CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = ComponentProps<typeof RadixCheckbox.Root> & {
  indeterminate?: boolean;
};

const Checkbox = ({
  indeterminate,
  className,
  checked,
  onChange,
  ...props
}: Props) => {
  const status = useMemo(() => {
    if (indeterminate) {
      return "indeterminate";
    }

    return checked;
  }, [indeterminate, checked]);

  console.log({ status, indeterminate });

  return (
    <RadixCheckbox.Root
      checked={status}
      onCheckedChange={(checked) => {
        onChange?.({
          target: {
            // @ts-expect-error
            checked: checked === "indeterminate" ? false : checked,
            indeterminate: checked === "indeterminate",
          },
        });
      }}
      className={clsx(
        "h-4 w-4 rounded border border-gray-200 bg-white text-nextadmin-primary-600",
        {
          "ring-1 ring-offset-1 ring-nextadmin-primary-600": status === true,
        },
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        {indeterminate && <MinusIcon />}
        {status === true && <CheckIcon />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
