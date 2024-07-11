import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const FormStateContext = createContext({
  dirtyFields: [] as string[],
  setFieldDirty: (_name: string) => {},
  cleanAll: () => {},
});

export const useFormState = () => useContext(FormStateContext);

const FormProvider = ({ children }: PropsWithChildren) => {
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  const setFieldDirty = (name: string) => {
    setDirtyFields((prevDirtyFields) => {
      if (!prevDirtyFields.includes(name)) {
        return [...prevDirtyFields, name];
      }
      return prevDirtyFields;
    });
  };

  const cleanAll = () => {
    setDirtyFields([]);
  };

  useEffect(() => {
    const onBeforeUnload = (e: any) => {
      if (dirtyFields.length === 0) {
        return;
      }
      e.preventDefault();
      e.returnValue = true;
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [dirtyFields]);

  return (
    <FormStateContext.Provider value={{ dirtyFields, setFieldDirty, cleanAll }}>
      {children}
    </FormStateContext.Provider>
  );
};

export default FormProvider;
