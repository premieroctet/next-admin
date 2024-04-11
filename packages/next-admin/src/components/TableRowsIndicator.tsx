import { useI18n } from "../context/I18nContext";

interface Props {
  currentPageIndex: number;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
}
export default function TableRowsIndicator({
  currentPageIndex,
  pageIndex,
  pageSize,
  totalRows,
}: Props) {
  const { t } = useI18n();

  const start = currentPageIndex * pageSize + 1;
  const end = Math.min(pageSize * (pageIndex + 1), totalRows);
  return (
    <div>
      <p className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default text-sm font-light">
        {t("list.footer.indicator.showing")}{" "}
        <span className="font-medium">{start}</span>{" "}
        {t("list.footer.indicator.to")}{" "}
        <span className="font-medium">{end}</span>{" "}
        {t("list.footer.indicator.of")}{" "}
        <span className="font-medium">{totalRows}</span>
      </p>
    </div>
  );
}
