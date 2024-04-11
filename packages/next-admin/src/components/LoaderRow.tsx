import clsx from "clsx";
import { forwardRef } from "react";
import Loader from "../assets/icons/Loader";
import { useI18n } from "../context/I18nContext";

const LoadingRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { t } = useI18n();

  return (
    <div
      className={clsx(
        "flex justify-start items-center py-2 px-3 text-gray-400 text-sm",
        props.className
      )}
      {...props}
      ref={ref}
    >
      <Loader className="w-5 h-5 stroke-gray-400 animate-spin" />
      <span className="ml-3">{t("selector.loading")}</span>
    </div>
  );
});

export default LoadingRow;
