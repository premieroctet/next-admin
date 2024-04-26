import { RJSFSchema } from "@rjsf/utils";
import { useForm } from "../../../context/FormContext";
import useDataColumns from "../../../hooks/useDataColumns";
import { DataEnumeration } from "../../../types";
import { DataTable } from "../../DataTable";
import { useState } from "react";
import { useI18n } from "../../../context/I18nContext";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
} from "../../radix/Dialog";
import MultiSelectListDialog from "./MultiSelectListDialog";
import Button from "../../radix/Button";

type Props = {
  formData: DataEnumeration[];
  name: string;
  schema: RJSFSchema;
  onChange: (values: DataEnumeration[]) => void;
};

const MultiSelectDisplayAdminList = ({
  formData,
  name,
  schema,
  onChange,
}: Props) => {
  const { resourcesIdProperty } = useForm();
  const columns = useDataColumns({
    data: formData.map((data) => data.data),
    sortable: false,
    resourcesIdProperty: resourcesIdProperty!,
    // @ts-expect-error
    resource: schema.items?.relation,
  });
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={formData.map((data) => data.data)}
          // @ts-expect-error
          resource={schema.items?.relation}
          resourcesIdProperty={resourcesIdProperty!}
          rowSelection={{}}
        />
        <DialogTrigger asChild className="mt-2">
          <Button>{t("form.widgets.multiselect.select")}</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <MultiSelectListDialog
              name={name}
              values={formData}
              onConfirm={(values) => {
                onChange(values as DataEnumeration[]);
                setOpen(false);
              }}
              // @ts-expect-error
              resourceName={schema.items!.relation as ModelName}
              display="admin-list"
            />
          </DialogContent>
        </DialogPortal>
      </div>
    </DialogRoot>
  );
};

export default MultiSelectDisplayAdminList;
