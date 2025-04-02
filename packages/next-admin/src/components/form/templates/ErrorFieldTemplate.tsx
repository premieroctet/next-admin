import React from "react";
import { useI18n } from "../../../context/I18nContext";

export const FieldErrorTemplate = ({ errors }: { errors: string[] }) => {

  const { t } = useI18n();

  return errors && errors.length > 0 ? (
    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
      {errors.map((error, idx) => {
        if (typeof error === "string") {
          return <React.Fragment key={idx}>{t(error)}</React.Fragment>;
        }

        return <React.Fragment key={idx}>{error}</React.Fragment>;
      })}
    </div>
  ) : null;
}