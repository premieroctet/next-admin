import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled, schema, required } = props;
  return (
    <MultiSelectWidget
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled}
      required={required}
      schema={schema}
    />
  );
};

export default ArrayField;
