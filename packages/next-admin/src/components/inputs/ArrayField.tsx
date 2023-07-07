import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelectWidget";
import { JSONSchema7 } from "json-schema";

const ArrayField = (props: FieldProps) => {
  const { schema, formData, onChange, name } = props;
  const options = (schema.items as JSONSchema7).enum;
  return (
    <MultiSelectWidget
      options={options}
      onChange={onChange}
      formData={formData}
      name={name}
    />
  );
};

export default ArrayField;
