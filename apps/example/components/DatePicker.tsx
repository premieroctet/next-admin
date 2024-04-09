"use client";
import { CustomInputProps } from "@premieroctet/next-admin";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = CustomInputProps;

const DatePicker = ({ value, name, onChange }: Props) => {
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
        className="block w-full transition-all duration-300 rounded-md border-0 py-1.5 dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted shadow-sm ring-1 ring-inset ring-nextadmin-border-default placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:cursor-not-allowed [&>div]:border-none"
      />
      <input type="hidden" name={name} value={value ?? ""} />
    </>
  );
};

export default DatePicker;
