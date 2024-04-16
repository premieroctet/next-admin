import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { FieldProps } from "@rjsf/utils";
import { useI18n } from "../../context/I18nContext";

const NullField = ({ schema }: FieldProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-nextadmin-alert-info-background dark:bg-dark-nextadmin-alert-info-background text-nextadmin-alert-info-content dark:text-dark-nextadmin-alert-info-content w-full rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold">{t(schema.title!)}</h3>
          {!!schema.description && (
            <p className="text-sm font-light">{t(schema.description)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NullField;
