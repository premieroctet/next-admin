import { createContext, useContext, useState } from "react";

type FormContextType = {
  form: {
    data: Record<string, any>;
    schema: Record<string, any>;
    setField: (name: string, value: any) => void;
    getField: (name: string) => any;
    getFieldSchema: (name: string) => any;
  };
};

export const FormContext = createContext<FormContextType>({
  form: {
    data: {},
    schema: {},
    setField: () => { },
    getField: () => undefined,
    getFieldSchema: () => undefined,
  },
});

export type FormProviderProps = {
  form: {
    data: Record<string, any>;
    schema: Record<string, any>;
  };
  children: React.ReactNode;
};
export const FormProvider = ({ form, children }: FormProviderProps) => {
  const [formData, setFormData] = useState(form.data);
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  const setField = (name: string, value: any) => {
    setDirtyFields(prev => {
      if (prev.includes(name)) {
        return prev;
      }

      return [...prev, name];
    });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getField = (name: string) => {
    return formData[name];
  };

  const getFieldSchema = (name: string) => {
    return form.schema?.properties?.[name];
  };

  return (
    <FormContext.Provider
      value={{
        form: {
          data: formData,
          schema: form.schema,
          setField,
          getField,
          getFieldSchema,
        }
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const createForm = ({ data, schema }: { data: Record<string, any>, schema: Record<string, any> }) => {
  return {
    data,
    schema,
  };
};

export const useForm = () => {
  return useContext(FormContext);
};
