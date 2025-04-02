import { useConfig } from "../context/ConfigContext";
import { useForm } from "../context/FormContext";
import { useI18n } from "../context/I18nContext";

export type FieldProps = {
  tooltip?: string;
  required?: boolean;
  description?: string;
  errors?: string[];
  help?: React.ReactNode;
  label?: string;
  name: string;
};

export const useField = ({ name }: FieldProps) => {
  const { form: {getFieldSchema, getField, setField} } = useForm();
  const value = getField(name);
  const { modelOptions } = useConfig();
  const { t } = useI18n();

  const onChange = (newValue: any) => {
    const value = newValue?.target?.value ?? newValue;
    setField(name, value);
  };

  const tooltip =
    modelOptions?.edit?.fields?.[name as keyof typeof modelOptions.edit.fields]?.tooltip ||
    modelOptions?.edit?.customFields?.[name]?.tooltip;

  // const labelAlias =
  //   modelOptions?.aliases?.[name as Field<typeof resource>] ||
  //   formatLabel(label);
  // const labelName = t(`model.${resource}.fields.${name}`, {}, labelAlias);

  // let styleField = modelOptions?.edit?.styles?.[name as Field<typeof resource>];
  const schema = getFieldSchema(name);

  return {
    name,
    value,
    onChange,
    tooltip,
    required: schema?.__nextadmin?.required,
    disabled: schema?.__nextadmin?.disabled,
    description: undefined,
    errors: [],
    help: undefined,
    label: name,
    style: undefined,
  };
};
