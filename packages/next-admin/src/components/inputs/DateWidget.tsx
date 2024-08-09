import {
  FormContextType,
  getTemplate,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";
import { useCallback } from "react";
import { useFormState } from "../../context/FormStateContext";

/** The `DateWidget` component uses the `BaseInputTemplate` changing the type to `date` and transforms
 * the value to undefined when it is falsy during the `onChange` handling.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function DateWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const { onChange, options, registry, value } = props;
  const BaseInputTemplate = getTemplate<"BaseInputTemplate", T, S, F>(
    "BaseInputTemplate",
    registry,
    options
  );
  const { setFieldDirty } = useFormState();

  const handleChange = useCallback(
    (value: any) => {
      setFieldDirty(props.name);
      onChange(value || undefined);
    },
    [onChange]
  );

  const inputValue = value
    ? new Date(value).toISOString().split("T")[0]
    : undefined;

  return (
    <BaseInputTemplate
      type="date"
      {...props}
      value={inputValue}
      onChange={handleChange}
    />
  );
}
