import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled, schema } = props;
  return (
    <MultiSelectWidget
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled}
      schema={schema}
    />
  );
};

export default ArrayField;
