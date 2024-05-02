import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { ComponentProps, useMemo } from "react";

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
        "outline-nextadmin-primary-500 flex h-4 w-4 items-center justify-center rounded border text-white focus:outline focus:outline-1 focus:outline-offset-2",
        (status === true || status === "indeterminate") &&
          "border-nextadmin-primary-500 bg-nextadmin-primary-500 ",
        status === false &&
          "border-nextadmin-border-default dark:border-dark-nextadmin-border-default bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default",
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
