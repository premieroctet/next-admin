import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  Dispatch,
} from "react";
import { RelationshipsRawData } from "../types";

const FormDataContext = createContext<{
  formData: any;
  setFormData: Dispatch<any>;
  relationshipsRawData?: RelationshipsRawData;
}>({
  formData: {},
  setFormData: () => {},
});

export const useFormData = () => useContext(FormDataContext);

const FormDataProvider = ({
  data,
  children,
  relationshipsRawData,
}: PropsWithChildren<{
  data: any;
  relationshipsRawData?: RelationshipsRawData;
}>) => {
  const [formData, setFormData] = useState<any>(data);
  useEffect(() => {
    setFormData(data);
  }, [data]);

  return (
    <FormDataContext.Provider
      value={{ formData, setFormData, relationshipsRawData }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataProvider;
