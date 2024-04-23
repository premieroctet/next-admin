import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";
import { JSONSchema7 } from "json-schema";
import { Enumeration } from "../../types";

const ArrayField = (props: FieldProps) => {
  const { schema, formData, onChange, name, disabled } = props;
  const options = (schema.items as JSONSchema7).enum as Enumeration[];
  return (
    <MultiSelectWidget
      options={options}
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled}
      schema={schema}
    />
  );
};

export default ArrayField;
