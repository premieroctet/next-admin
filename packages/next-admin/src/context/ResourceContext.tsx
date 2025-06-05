"use client";
import { UiSchema } from "@rjsf/utils";
import { createContext, PropsWithChildren, useContext } from "react";
import { ModelName, SchemaModel } from "../types";

export type ResourceContextType<M extends ModelName = ModelName> = {
  resource: M;
  modelSchema: SchemaModel<M>;
  uiSchema: UiSchema;
};

const ResourceContext = createContext<ResourceContextType | null>(null);

type ResourceProviderProps<M extends ModelName> = PropsWithChildren<{
  resource: M;
  modelSchema: SchemaModel<M>;
  uiSchema: UiSchema;
}>;

const ResourceProvider = <M extends ModelName>({
  children,
  resource,
  modelSchema,
  uiSchema,
}: ResourceProviderProps<M>) => {
  const contextValue: ResourceContextType<M> = {
    resource,
    modelSchema,
    uiSchema,
  };

  return (
    <ResourceContext.Provider value={contextValue as ResourceContextType}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = <M extends ModelName = ModelName>() => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context as ResourceContextType<M>;
};

export default ResourceProvider; 