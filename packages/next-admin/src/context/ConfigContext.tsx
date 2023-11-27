"use client";
import React, { useContext } from "react";

export type ConfigContextType = {
  basePath: string;
  isAppDir: boolean;
};

const ConfigContext = React.createContext<ConfigContextType>(
  {} as ConfigContextType
);

type ProviderProps = {
  basePath: string;
  children: React.ReactNode;
  isAppDir?: boolean;
};

export const ConfigProvider = ({
  children,
  basePath,
  isAppDir = false,
}: ProviderProps) => {
  return (
    <ConfigContext.Provider
      value={{
        basePath,
        isAppDir,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
