import { FieldProps } from "@rjsf/utils";
import type { CustomInputProps, Enumeration, FormProps } from "../../types";
import MultiSelectWidget from "./MultiSelect/MultiSelectWidget";
import ScalarArrayField from "./ScalarArray/ScalarArrayField";
import FileWidget from "./FileWidget/FileWidget";

const ArrayField = (
  props: FieldProps & { customInput?: React.ReactElement<CustomInputProps> }
) => {
  const {
    formData,
    onChange,
    name,
    disabled,
    schema,
    required,
    formContext,
    customInput,
  } = props;

  const resourceDefinition: FormProps["schema"] = formContext.schema;

  const field =
    resourceDefinition.properties[
      name as keyof typeof resourceDefinition.properties
    ];

  if (field?.__nextadmin?.kind === "scalar" && field?.__nextadmin?.isList) {
    if (schema.format === "data-url") {
      return (
        <FileWidget
          id={props.name}
          name={props.name}
          value={props.formData}
          disabled={props.disabled}
          rawErrors={props.rawErrors}
          required={props.required}
          schema={props.schema}
        />
      );
    }

    return (
      <ScalarArrayField
        name={name}
        formData={formData}
        onChange={onChange}
        disabled={disabled ?? false}
        schema={schema}
        customInput={customInput}
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
