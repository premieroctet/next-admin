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
        'data-[state="checked"]:!bg-nextadmin-primary-500 data-[state="checked"]:border-nextadmin-primary-500 data-[state="indeterminate"]:!bg-nextadmin-primary-500 data-[state="indeterminate"]:border-nextadmin-primary-500 flex h-4 w-4 items-center justify-center rounded border border-gray-200 bg-white text-white dark:border-gray-400 dark:bg-slate-500',
        {
          "ring-nextadmin-primary-600 ring-1 ring-offset-1": status === true,
        },
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        {indeterminate && <MinusIcon className="h-4 w-4" />}
        {status === true && <CheckIcon className="h-4 w-4" />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
