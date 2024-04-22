import { FieldProps } from "@rjsf/utils";
import MultiSelectWidget from "./MultiSelectWidget";

const ArrayField = (props: FieldProps) => {
  const { formData, onChange, name, disabled } = props;
  return (
    <MultiSelectWidget
      onChange={onChange}
      formData={formData}
      name={name}
      disabled={disabled}
    />
  );
};

export default ArrayField;
