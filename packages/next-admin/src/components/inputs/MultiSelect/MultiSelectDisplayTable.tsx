import { RJSFSchema } from "@rjsf/utils";
import { useConfig } from "../../../context/ConfigContext";
import useDataColumns from "../../../hooks/useDataColumns";
import { Enumeration, RelationshipPagination } from "../../../types";
import { DataTable } from "../../DataTable";
import useLocalPagination from "../../../hooks/useLocalPagination";
import { Pagination } from "../../Pagination";

type Props = {
  formData: Enumeration[];
  schema: RJSFSchema;
  onRemoveClick: (value: any) => void;
  deletable: boolean;
  pagination?: RelationshipPagination;
};

const MultiSelectDisplayTable = ({
  formData,
  schema,
  deletable,
  onRemoveClick,
  pagination,
}: Props) => {
  const { resourcesIdProperty } = useConfig();
  const { dataToRender, handlePageChange, totalPages, pageIndex } =
    useLocalPagination<Enumeration>(
      formData,
      pagination ? (pagination.perPage ?? 20) : undefined
    );

  const columns = useDataColumns({
    data: dataToRender?.map((data) => data.data),
    sortable: false,
    resourcesIdProperty: resourcesIdProperty!,
    // @ts-expect-error
    resource: schema.items?.relation,
  });

  return (
    formData?.map((data) => data.data).length > 0 && (
      <div className="flex flex-col gap-2">
        <DataTable
          columns={columns}
          data={dataToRender?.map((data) => data.data)}
          // @ts-expect-error
          resource={schema.items?.relation}
          resourcesIdProperty={resourcesIdProperty!}
          rowSelection={{}}
          deletable={deletable}
          onRemoveClick={onRemoveClick}
        />
        {!!pagination && (
          <div className="self-end">
            <Pagination
              currentPageIndex={pageIndex}
              totalPageCount={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    )
  );
};

export default MultiSelectDisplayTable;
