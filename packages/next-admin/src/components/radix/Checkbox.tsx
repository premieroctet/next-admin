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
        'flex justify-center items-center h-4 w-4 rounded border border-gray-200 bg-white dark:bg-slate-500 dark:border-gray-400 text-white data-[state="checked"]:!bg-nextadmin-primary-500 data-[state="checked"]:border-nextadmin-primary-500 data-[state="indeterminate"]:!bg-nextadmin-primary-500 data-[state="indeterminate"]:border-nextadmin-primary-500',
        {
          "ring-1 ring-offset-1 ring-nextadmin-primary-600": status === true,
        },
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        {indeterminate && <MinusIcon className="w-4 h-4" />}
        {status === true && <CheckIcon className="w-4 h-4" />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
