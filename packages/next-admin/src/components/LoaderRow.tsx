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
        "flex items-center justify-start px-3 py-2",
        "dark:bg-dark-nextadmin-background-subtle",
        props.className
      )}
      {...props}
      ref={ref}
    >
      <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-5 w-5 animate-spin dark:stroke-gray-400" />
      <span className="dark:text-dark-nextadmin-content-default ml-3 text-sm text-gray-400">
        {t("selector.loading")}
      </span>
    </div>
  );
});

export default LoadingRow;
