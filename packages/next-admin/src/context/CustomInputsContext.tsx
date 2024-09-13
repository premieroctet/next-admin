import React, { createContext, PropsWithChildren, useContext } from "react";

const CustomInputsContext = createContext<
  Record<string, React.ReactElement | undefined> | undefined
>({});

export const useCustomInputs = () => useContext(CustomInputsContext);

const CustomInputsProvider = ({
  customInputs,
  children,
}: PropsWithChildren<{
  customInputs: Record<string, React.ReactElement | undefined> | undefined;
}>) => {
  return (
    <CustomInputsContext.Provider value={customInputs}>
      {children}
    </CustomInputsContext.Provider>
  );
};

export default CustomInputsProvider;
