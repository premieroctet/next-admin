import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RJSFSchema } from "@rjsf/utils";
import clsx from "clsx";
import Link from "next/link";
import { useConfig } from "../../../context/ConfigContext";
import { Enumeration, ModelName } from "../../../types";
import { slugify } from "../../../utils/tools";
import Button from "../../radix/Button";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
} from "../../radix/Dialog";
import MultiSelectListDialog from "./MultiSelectListDialog";
import { useState } from "react";
import { useI18n } from "../../../context/I18nContext";

type Props = {
  formData: any;
  schema: RJSFSchema;
  name: string;
  initialOptions?: Enumeration[];
  onChange: (values: Enumeration[]) => void;
};

const MultiSelectDisplayList = ({
  formData,
  schema,
  name,
  initialOptions,
  onChange,
}: Props) => {
  const { basePath } = useConfig();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <ul className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted space-y-2">
        {formData?.map((value: Enumeration, index: number) => {
          return (
            <li
              key={index}
              className={clsx(
                "border-nextadmin-border-default dark:border-dark-nextadmin-border-default flex items-center justify-between rounded-lg border-2 px-2 py-1 text-sm"
              )}
            >
              {value.label}
              <div className="flex items-center gap-1">
                <Link
                  href={`${basePath}/${slugify(
                    // @ts-expect-error
                    schema.items?.relation
                  )}/${value?.value}`}
                  className="flex items-center"
                >
                  <Button variant="ghost" size="sm" icon>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 cursor-pointer" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" icon>
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <DialogTrigger asChild className="mt-2">
        <Button>{t("form.widgets.multiselect.select")}</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <MultiSelectListDialog
            name={name}
            initialOptions={initialOptions}
            values={formData}
            onConfirm={(values) => {
              onChange(values as Enumeration[]);
              setOpen(false);
            }}
            // @ts-expect-error
            resourceName={schema.items!.relation as ModelName}
            display="list"
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};

export default MultiSelectDisplayList;
