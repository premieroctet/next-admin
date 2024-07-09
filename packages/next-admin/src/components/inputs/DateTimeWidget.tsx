import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  getTemplate,
  localToUTC,
  utcToLocal,
} from "@rjsf/utils";
import { useMemo } from "react";

/** The `DateTimeWidget` component uses the `BaseInputTemplate` changing the type to `datetime-local` and transforms
 * the value to/from utc using the appropriate utility functions.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function DateTimeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ name, ...props }: WidgetProps<T, S, F>) {
  const { onChange, value, options, registry } = props;
  const BaseInputTemplate = getTemplate<"BaseInputTemplate", T, S, F>(
    "BaseInputTemplate",
    registry,
    options
  );

  const hiddenValue = useMemo(() => {
    return value ? new Date(value).toISOString() : "";
  }, [value]);

  return (
    <>
      <input
        name={name}
        defaultValue={hiddenValue}
        className="absolute inset-0 -z-10 h-full w-full opacity-0"
        step="0.001"
      />
      <BaseInputTemplate
        type="datetime-local"
        {...props}
        // @ts-expect-error
        name={undefined}
        value={utcToLocal(value)}
        onChange={(value) => {
          onChange(localToUTC(value));
        }}
        required={props.required}
        step="0.001"
      />
    </>
  );
}
