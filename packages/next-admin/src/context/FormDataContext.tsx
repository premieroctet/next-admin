import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

const FormDataContext = createContext({
  formData: {},
  setFormData: (_data: any) => {},
});

export const useFormData = () => useContext(FormDataContext);

const FormDataProvider = ({ data, children }: PropsWithChildren<{data: any}>) => {
  const [formData, setFormData] = useState<any>(data);

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const FormDataConsumer = FormDataContext.Consumer;

export default FormDataProvider;


