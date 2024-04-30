import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration } from "../../../types";
import { slugify } from "../../../utils/tools";

type Props = {
  formData: any;
  schema: RJSFSchema;
  onRemoveClick: (value: Enumeration["value"]) => void;
  deletable: boolean;
};

const MultiSelectDisplayList = ({
  formData,
  schema,
  onRemoveClick,
  deletable = true,
}: Props) => {
  const { basePath } = useConfig();

  return (
    <ul className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted space-y-2">
      {formData?.map((value: Enumeration, index: number) => {
        return (
          <li
            key={index}
            className={clsx(
              "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-default relative flex w-full cursor-default justify-between rounded-md px-3 py-2 text-sm placeholder-gray-500 shadow-sm ring-1"
            )}
          >
            {value.label}
            <div className="flex items-center space-x-3">
              {" "}
              <Link
                href={`${basePath}/${slugify(
                  // @ts-expect-error
                  schema.items?.relation
                )}/${value?.value}`}
                className="flex items-center"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5 cursor-pointer text-gray-400" />
              </Link>
              {deletable && (
                <div onClick={() => onRemoveClick(value.value)}>
                  <XMarkIcon className="h-5 w-5 cursor-pointer text-gray-400" />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MultiSelectDisplayList;
