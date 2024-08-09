import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  getTemplate,
  utcToLocal,
} from "@rjsf/utils";
import { useFormState } from "../../context/FormStateContext";

/** The `DateTimeWidget` component uses the `BaseInputTemplate` changing the type to `datetime-local` and transforms
 * the value to/from utc using the appropriate utility functions.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function DateTimeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const { onChange, value, options, registry } = props;
  const BaseInputTemplate = getTemplate<"BaseInputTemplate", T, S, F>(
    "BaseInputTemplate",
    registry,
    options
  );
  const { setFieldDirty } = useFormState();

  return (
    <BaseInputTemplate
      type="datetime-local"
      {...props}
      value={utcToLocal(value)}
      onChange={(value) => {
        setFieldDirty(props.name);
        onChange(value);
      }}
    />
  );
}
