"use client";
import { CustomInputProps } from "@premieroctet/next-admin";
import { inputVariants } from "@premieroctet/next-admin/dist/components";
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
        className={`${inputVariants({
          variant: "default",
        })} block w-full [&>div]:border-none`}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
};

export default DatePicker;
