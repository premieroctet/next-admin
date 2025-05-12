import { createContext, PropsWithChildren, useContext } from "react";
import type { RouterInterface } from "./types";

type RouterContextType = {
  router: () => RouterInterface;
};

export type RouterAdapterComponent = ReturnType<typeof createRouterAdapter>;

const RouterContext = createContext<RouterContextType>({
  router: () => {
    throw new Error("RouterAdapterProvider is not initialized");
  },
});

export const createRouterAdapter = (routerHook: () => RouterInterface) => {
  return function RouterAdapterProvider({ children }: PropsWithChildren) {
    return (
      <RouterContext.Provider value={{ router: routerHook }}>
        {children}
      </RouterContext.Provider>
    );
  };
};

export const useRouterAdapter = () => {
  const { router } = useContext(RouterContext);

  return router();
};
