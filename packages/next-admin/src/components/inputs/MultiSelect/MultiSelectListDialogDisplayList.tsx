import { Enumeration } from "../../../types";
import Spinner from "../../common/Spinner";
import Button from "../../radix/Button";
import Checkbox from "../../radix/Checkbox";

type Props = {
  options: Enumeration[];
  selectedValues: string[];
  onCheckValue: (option: Enumeration) => void;
  isPending: boolean;
  canShowMore?: boolean;
  onShowMore: () => void;
  hasNextPage: boolean;
};

const MultiSelectListDialogDisplayList = ({
  options,
  selectedValues,
  onCheckValue,
  isPending,
  canShowMore,
  hasNextPage,
  onShowMore,
}: Props) => {
  return (
    <div className="space-y-2">
      {!!options.length && (
        <ul className="max-h-[32rem] overflow-y-scroll">
          {options.map((option, index) => {
            const checked = selectedValues.some(
              (value) => value === option.value
            );

            return (
              <li
                key={option.value}
                className="border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted flex items-center gap-3 border-b-2 px-1 py-2 last:border-b-0"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => {
                    onCheckValue(option);
                  }}
                  id={`${name}-option-${option.value}`}
                />
                <label htmlFor={`${name}-option-${option.value}`}>
                  {option.label}
                </label>
              </li>
            );
          })}
        </ul>
      )}
      {isPending && (
        <div className="flex h-10 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
      {canShowMore && (
        <div className="flex w-full justify-center">
          <Button disabled={isPending || !hasNextPage} onClick={onShowMore}>
            Show more
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiSelectListDialogDisplayList;
