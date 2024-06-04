"use client";
import React, { useContext, useMemo } from "react";
import { NextAdminOptions } from "../types";

export type ConfigContextType = {
  options?: NextAdminOptions;
  basePath: string;
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
};

export const ConfigProvider = ({
  children,
  options,
  basePath,
  apiBasePath,
}: ProviderProps) => {
  const values = useMemo(() => {
    return {
      options,
      basePath,
      apiBasePath,
    };
  }, [options, basePath, apiBasePath]);

  return (
    <ConfigContext.Provider value={values}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
