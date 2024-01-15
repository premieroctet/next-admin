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
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed [&>div]:border-none"
      />
      <input type="hidden" name={name} value={value ?? ""} />
    </>
  );
};

export default DatePicker;
