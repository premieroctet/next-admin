"use client";
import React, { useContext, useMemo } from "react";
import {
  ModelName,
  NextAdminContext,
  NextAdminOptions,
  Schema,
} from "../types";

export type ConfigContextType = {
  options?: NextAdminOptions;
  basePath: string;
  isAppDir?: boolean;
  apiBasePath: string;
  resource?: ModelName | null;
  resourcesIdProperty: Record<ModelName, string> | null;
  schema: Schema;
  nextAdminContext?: NextAdminContext;
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
  resource?: ModelName | null;
  resourcesIdProperty: Record<ModelName, string> | null;
  schema: Schema;
  nextAdminContext?: NextAdminContext;
};

export const ConfigProvider = ({ children, ...props }: ProviderProps) => {
  const contextValue = useMemo(() => ({ ...props }), [props]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
