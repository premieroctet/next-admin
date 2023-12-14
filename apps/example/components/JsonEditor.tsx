"use client";
import Editor from "@monaco-editor/react";
import { CustomInputProps } from "@premieroctet/next-admin";
import { inputVariants } from "@premieroctet/next-admin/dist/components";
import { useMemo } from "react";

type Props = CustomInputProps;

const JsonEditor = ({ value, onChange, name }: Props) => {
  const defaultValue = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(value!), null, 2);
    } catch {
      return "";
    }
  }, []);

  return (
    <>
      <input type="hidden" name={name} value={value} />
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
        className={inputVariants({ variant: "default" })}
      />
    </>
  );
};

export default JsonEditor;
