import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { FieldProps } from "@rjsf/utils";
import { useI18n } from "../../context/I18nContext";

const NullField = ({ schema }: FieldProps) => {
  const { t } = useI18n();

  return (
    <div className="rounded-md bg-blue-50 p-4 w-full">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            {t(schema.title!)}
          </h3>
          {!!schema.description && (
            <p className="text-sm text-blue-700">{t(schema.description)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NullField;
