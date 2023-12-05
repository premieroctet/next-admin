"use client";
import { CustomInputProps } from "@premieroctet/next-admin";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type Props = CustomInputProps;

const DatePicker = ({ value, name, onChange }: Props) => {
  return (
    <DateTimePicker
      value={value ? new Date(value) : new Date()}
      onChange={(date) =>
        onChange?.({
          // @ts-expect-error
          target: { value: date?.toJSON() ?? new Date().toJSON() },
        })
      }
      name={name}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed [&>div]:border-none"
    />
  );
};

export default DatePicker;
