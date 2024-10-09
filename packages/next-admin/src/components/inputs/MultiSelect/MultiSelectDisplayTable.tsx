import { useConfig } from "../../../context/ConfigContext";
import useDataColumns from "../../../hooks/useDataColumns";
import { Enumeration, Field, ModelName, SchemaProperty } from "../../../types";
import { DataTable } from "../../DataTable";

type Props = {
  formData: Enumeration[];
  propertySchema: SchemaProperty<ModelName>[Field<ModelName>];
  onRemoveClick: (value: any) => void;
  deletable: boolean;
};

const MultiSelectDisplayTable = ({
  formData,
  propertySchema,
  deletable,
  onRemoveClick,
}: Props) => {
  const { resourcesIdProperty } = useConfig();
  const columns = useDataColumns({
    data: formData?.map((data) => data.data),
    sortable: false,
    resourcesIdProperty: resourcesIdProperty!,
    resource: propertySchema!.items!.relation!,
  });

  return (
    formData?.map((data) => data.data).length > 0 && (
      <DataTable
        columns={columns}
        data={formData?.map((data) => data.data)}
        resource={propertySchema!.items!.relation!}
        resourcesIdProperty={resourcesIdProperty!}
        rowSelection={{}}
        deletable={deletable}
        onRemoveClick={onRemoveClick}
      />
    )
  );
};

export default MultiSelectDisplayTable;
