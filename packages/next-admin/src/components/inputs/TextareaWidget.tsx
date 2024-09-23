import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  ariaDescribedByIds,
} from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, FocusEvent, useCallback } from "react";
import { useFormState } from "../../context/FormStateContext";

/** The `TextareaWidget` is a widget for rendering input fields as textarea.
 *
 * @param props - The `WidgetProps` for this component
 */
const TextareaWidget = <
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options = {},
  placeholder,
  value,
  required,
  disabled,
  readonly,
  autofocus = false,
  onChange,
  onBlur,
  onFocus,
  rawErrors,
}: WidgetProps<T, S, F>) => {
  const { setFieldDirty } = useFormState();
  const handleChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
      setFieldDirty(id);
      onChange(value === "" ? options.emptyValue : value);
    },
    [onChange, options.emptyValue]
  );

  const handleBlur = useCallback(
    ({ target: { value } }: FocusEvent<HTMLTextAreaElement>) =>
      onBlur(id, value),
    [onBlur, id]
  );

  const handleFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLTextAreaElement>) =>
      onFocus(id, value),
    [id, onFocus]
  );

  return (
    <textarea
      id={id}
      name={id}
      className={clsx(
        "form-control",
        "dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-t-md rounded-bl-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-colors duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6",
        { "ring-red-600 dark:ring-red-400": rawErrors }
      )}
      value={value ? value : ""}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={options.rows}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
};

export default TextareaWidget;
