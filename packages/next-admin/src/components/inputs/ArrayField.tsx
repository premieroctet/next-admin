import { FieldProps } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import type { Enumeration } from "../../types";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";
import ScalarArrayField from "./ScalarArray/ScalarArrayField";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled, schema, required } = props;

  const childSchema = schema.items as JSONSchema7;

  if (
    (childSchema.type === "string" ||
      childSchema.type === "number" ||
      childSchema.type === "integer") &&
    schema.type === "array" &&
    // @ts-expect-error
    !childSchema.relation
  ) {
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

  const options = schema.enum as Enumeration[] | undefined;

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
