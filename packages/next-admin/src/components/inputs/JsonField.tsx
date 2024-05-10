"use client";
import Editor from "@monaco-editor/react";
import { useMemo } from "react";
import { useColorScheme } from "../../context/ColorSchemeContext";
import { CustomInputProps } from "../../types";

type Props = CustomInputProps;

const JsonField = ({ value, onChange, name, disabled, required }: Props) => {
  const { colorScheme } = useColorScheme();

  const defaultValue = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(value!), null, 2);
    } catch {
      return "";
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        name={name}
        defaultValue={value ?? ""}
        className="absolute inset-0 -z-10 h-full w-full opacity-0"
        required={required}
      />
      <Editor
        height="20vh"
        defaultLanguage="json"
        defaultValue={defaultValue}
        onChange={(val, evt) => {
          // @ts-expect-error
          onChange?.({ target: { value: val ?? "" } });
        }}
        options={{
          minimap: { enabled: false },
          readOnly: disabled,
        }}
        theme={colorScheme === "light" ? "light" : "vs-dark"}
        className="dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-all duration-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 [&>div]:border-none"
      />
    </div>
  );
};

export default JsonField;
