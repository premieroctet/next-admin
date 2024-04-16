"use client";
import React, { useContext } from "react";
import { NextAdminOptions } from "../types";

export type ConfigContextType = {
  options?: NextAdminOptions;
  basePath: string;
  isAppDir: boolean;
};

const ConfigContext = React.createContext<ConfigContextType>(
  {} as ConfigContextType
);

type ProviderProps = {
  basePath: string;
  options?: NextAdminOptions;
  children: React.ReactNode;
  isAppDir?: boolean;
};

export const ConfigProvider = ({
  children,
  options,
  basePath,
  isAppDir = false,
}: ProviderProps) => {
  return (
    <ConfigContext.Provider
      value={{
        options,
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
