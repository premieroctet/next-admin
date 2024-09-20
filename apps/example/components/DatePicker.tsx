"use client";
import { CustomInputProps } from "@premieroctet/next-admin";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = CustomInputProps;

const DatePicker = ({ value, name, onChange, disabled, required }: Props) => {
  return (
    <>
      <DateTimePicker
        selected={value ? new Date(value) : null}
        onChange={(date) =>
          onChange?.({
            // @ts-expect-error
            target: { value: date?.toISOString() ?? new Date().toISOString() },
          })
        }
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        timeFormat="HH:mm"
        wrapperClassName="w-full"
        disabled={disabled}
        required={required}
        className="dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 focus:ring-1 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 [&>div]:border-none"
      />
      <input type="hidden" name={name} value={value ?? ""} step="0.001" />
    </>
  );
};

export default DatePicker;
