import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const FormDataContext = createContext({
  formData: {},
  setFormData: (_data: any) => {},
});

export const useFormData = () => useContext(FormDataContext);

const FormDataProvider = ({
  data,
  children,
}: PropsWithChildren<{ data: any }>) => {
  const [formData, setFormData] = useState<any>(data);
  useEffect(() => {
    setFormData(data);
  }, [data]);

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;
