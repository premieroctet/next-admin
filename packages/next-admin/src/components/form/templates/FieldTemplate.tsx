import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "../../radix/Tooltip";
import { DescriptionFieldTemplate } from "./DescriptionFieldTemplate";
import { FieldErrorTemplate } from "./ErrorFieldTemplate";

export type FieldTemplateProps = {
  children: React.ReactNode;
  labelName: string;
  required: boolean;
  tooltip?: string;
  description?: string;
  errors?: string[];
  help?: React.ReactNode;
  name: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const FieldTemplate = ({ children, className, labelName, required, tooltip, description, errors, help, name }: FieldTemplateProps) => {
  return <>
    <label
      className={clsx(
        "text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted mb-2 flex items-center gap-2 text-sm font-medium leading-6"
      )}
      htmlFor={name}
    >
      {labelName}
      {required && "*"}
      {!!tooltip && (
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <InformationCircleIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-4 w-4" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="right"
                className="px-2 py-1"
                sideOffset={4}
              >
                {tooltip}
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
      )}
    </label>
    {children}
    {description && <DescriptionFieldTemplate description={description} />}
    {errors && <FieldErrorTemplate errors={errors} />}
    {help}
  </>
};
