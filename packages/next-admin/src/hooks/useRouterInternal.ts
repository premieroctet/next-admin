import { useRouterAdapter } from "../adapters/context";

export const useRouterInternal = () => {
  return useRouterAdapter();
};
