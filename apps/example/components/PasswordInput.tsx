"use client";

import { useState } from "react";
import type { CustomInputProps } from "@premieroctet/next-admin";

const PasswordInput = (props: CustomInputProps) => {
  const [changePassword, setChangePassword] = useState(false);

  if (props.mode === "create") {
    return <PasswordBaseInput {...props} />;
  }

  return (
    <div className="flex flex-col items-start gap-4">
      {changePassword && <PasswordBaseInput {...props} />}
      <button
        onClick={() => {
          setChangePassword((value) => !value);
          // @ts-expect-error
          props?.onChange({ target: { value: undefined } });
        }}
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {changePassword ? "Close" : "Change Password"}
      </button>
    </div>
  );
};

const PasswordBaseInput = (props: CustomInputProps & {}) => (
  <input
    type="password"
    onChange={props.onChange}
    name={props.name}
    required={props.required}
    value={props.value ?? ""}
    className="dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-colors duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6"
  />
);

export default PasswordInput;
