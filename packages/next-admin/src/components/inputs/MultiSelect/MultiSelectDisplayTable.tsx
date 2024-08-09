import { RJSFSchema } from "@rjsf/utils";
import { useConfig } from "../../../context/ConfigContext";
import useDataColumns from "../../../hooks/useDataColumns";
import { Enumeration } from "../../../types";
import { DataTable } from "../../DataTable";

type Props = {
  formData: Enumeration[];
  schema: RJSFSchema;
  onRemoveClick: (value: any) => void;
  deletable: boolean;
};

const MultiSelectDisplayTable = ({
  formData,
  schema,
  deletable,
  onRemoveClick,
}: Props) => {
  const { resourcesIdProperty } = useConfig();
  const columns = useDataColumns({
    data: formData?.map((data) => data.data),
    sortable: false,
    resourcesIdProperty: resourcesIdProperty!,
    // @ts-expect-error
    resource: schema.items?.relation,
  });

  return (
    formData?.map((data) => data.data).length > 0 && (
      <DataTable
        columns={columns}
        data={formData?.map((data) => data.data)}
        // @ts-expect-error
        resource={schema.items?.relation}
        resourcesIdProperty={resourcesIdProperty!}
        rowSelection={{}}
        deletable={deletable}
        onRemoveClick={onRemoveClick}
      />
    )
  );
};

export default MultiSelectDisplayTable;
