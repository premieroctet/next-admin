"use client";
import { UiSchema } from "@rjsf/utils";
import React, { useContext } from "react";
import { ModelName, SchemaModel } from "../types";
import { slugify } from "../utils/tools";
import { useConfig } from "./ConfigContext";

export type ResourceContextType = {
  resource: ModelName;
  modelSchema?: SchemaModel<ModelName>;
  uiSchema?: UiSchema;
};

const ResourceContext = React.createContext<ResourceContextType>(
  {} as ResourceContextType
);

type ProviderProps = {
  resource: ModelName;
  modelSchema: SchemaModel<ModelName>;
  uiSchema: UiSchema;
  children: React.ReactNode;
};

const ResourceProvider = ({
  children,
  resource,
  modelSchema,
  uiSchema,
}: ProviderProps) => {
  const { resources } = useConfig();
  const normalizedResource = resources?.find((key): key is ModelName => {
    return slugify(key) === slugify(resource);
  });
  if (!resource || !resources || !normalizedResource) {
    throw new Error(`Resource ${resource} not found in resources`);
  }

  return (
    <ResourceContext.Provider
      value={{
        resource: normalizedResource,
        modelSchema: modelSchema,
        uiSchema: uiSchema,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  return useContext(ResourceContext);
};

export default ResourceProvider;
