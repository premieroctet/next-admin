"use client";
import Editor from '@monaco-editor/react';
import { useMemo } from 'react';
import { CustomInputProps } from '../../types';

type Props = CustomInputProps;

const JsonField = ({ value, onChange, name }: Props) => {
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
          onChange?.({ target: { value: val ?? "" } })
        }}
        options={{
          minimap: { enabled: false },
        }}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed [&>div]:border-none"
      />
    </>
  );
};

export default JsonField
