"use client";
import React, { useContext } from "react";
import { NextAdminOptions } from "../types";

export type ConfigContextType = {
  options?: NextAdminOptions;
  basePath: string;
  isAppDir: boolean;
  apiBasePath: string;
};

const ConfigContext = React.createContext<ConfigContextType>(
  {} as ConfigContextType
);

type ProviderProps = {
  basePath: string;
  apiBasePath: string;
  options?: NextAdminOptions;
  children: React.ReactNode;
  isAppDir?: boolean;
};

export const ConfigProvider = ({
  children,
  options,
  basePath,
  isAppDir = false,
  apiBasePath,
}: ProviderProps) => {
  return (
    <ConfigContext.Provider
      value={{
        options,
        basePath,
        isAppDir,
        apiBasePath,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
