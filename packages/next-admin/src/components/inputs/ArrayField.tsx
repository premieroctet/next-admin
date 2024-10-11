import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";
import ScalarArrayField from "./ScalarArray/ScalarArrayField";
import type { Enumeration, FormProps, ModelName } from "../../types";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled, schema, required, formContext } =
    props;

  const resourceDefinition: FormProps["schema"] = formContext.schema;

  const field =
    resourceDefinition.properties[
      name as keyof typeof resourceDefinition.properties
    ];

  if (field?.__nextadmin?.kind === "scalar" && field?.__nextadmin?.isList) {
    return (
      <ScalarArrayField
        name={name}
        formData={formData}
        onChange={onChange}
        disabled={disabled ?? false}
        schema={schema}
      />
    );
  }

  const options =
    field?.__nextadmin?.kind === "enum"
      ? (schema.enum as Enumeration[])
      : undefined;

  return (
    <MultiSelectWidget
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled ?? false}
      required={required}
      schema={schema}
      options={options}
    />
  );
};

export default ArrayField;
