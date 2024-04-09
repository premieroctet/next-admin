"use client";
import Editor from "@monaco-editor/react";
import { useMemo } from "react";
import { CustomInputProps } from "../../types";
import { useColorScheme } from "../../context/ColorSchemeContext";

type Props = CustomInputProps;

const JsonField = ({ value, onChange, name }: Props) => {
  const { colorScheme } = useColorScheme();

  const defaultValue = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(value!), null, 2);
    } catch {
      return "";
    }
  }, []);

  return (
    <>
      <input type="hidden" name={name} value={value ?? ""} />
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
        }}
        theme={colorScheme === "light" ? "light" : "vs-dark"}
        className="block w-full transition-all duration-300 rounded-md border-0 py-1.5 dark:bg-dark-nextadmin-background-subtle dark:ring-dark-nextadmin-border-strong text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted shadow-sm ring-1 ring-inset ring-nextadmin-border-default placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:cursor-not-allowed [&>div]:border-none"
      />
    </>
  );
};

export default JsonField;
