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
  children,
}: PropsWithChildren) => {
  const [formData, setFormData] = useState<any>({});

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const FormDataConsumer = FormDataContext.Consumer;

export default FormDataProvider;


