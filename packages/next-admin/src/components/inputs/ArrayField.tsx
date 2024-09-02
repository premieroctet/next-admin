import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";
import ScalarArrayField from "./ScalarArray/ScalarArrayField";
import type { FormProps } from "../../types";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled, schema, required, formContext } =
    props;

  const dmmfSchema = formContext.dmmfSchema as FormProps["dmmfSchema"];

  const dmmfField = dmmfSchema.find((field) => field.name === name);

  if (dmmfField?.kind === "scalar" && dmmfField?.isList) {
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

  return (
    <MultiSelectWidget
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled ?? false}
      required={required}
      schema={schema}
    />
  );
};

export default ArrayField;
