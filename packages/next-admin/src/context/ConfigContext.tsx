import React, { useContext } from "react";

export type ConfigContextType = {
  basePath: string;
};

const ConfigContext = React.createContext<ConfigContextType>(
  {} as ConfigContextType
);

type ProviderProps = {
  basePath: string;
  children: React.ReactNode;
};

export const ConfigProvider = ({ children, basePath }: ProviderProps) => {
  return (
    <ConfigContext.Provider
      value={{
        basePath,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
