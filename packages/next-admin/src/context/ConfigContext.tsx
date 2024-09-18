"use client";
import React, { useContext, useMemo } from "react";
import { ModelName, NextAdminOptions } from "../types";

export type ConfigContextType = {
  options?: NextAdminOptions;
  basePath: string;
  isAppDir?: boolean;
  apiBasePath: string;
  resourcesIdProperty: Record<ModelName, string> | null;
  resources?: ModelName[];
  toModelName: (str: string) => ModelName;
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
  resourcesIdProperty: Record<ModelName, string> | null;
  resources?: ModelName[];
};

export const ConfigProvider = ({ children, ...props }: ProviderProps) => {
  const contextValue = useMemo(() => ({ ...props }), [props]);

  const toModelName = (str: string): ModelName => {
    const modelName = props.resources?.find((key): key is ModelName => {
      return key.toLowerCase() === str.toLowerCase();
    });
    if (!modelName) {
      throw new Error(`Model name not found for ${str}`);
    }
    return modelName;
  };

  const newContextValue = { ...contextValue, toModelName };

  return (
    <ConfigContext.Provider value={newContextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
