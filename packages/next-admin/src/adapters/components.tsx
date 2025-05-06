import { PropsWithChildren } from "react";
import { MainLayout as MainLayoutComponent } from "../components/MainLayout";
import { NextAdmin as NextAdminComponent } from "../components/NextAdmin";
import { AdminComponentProps, CustomUIProps, MainLayoutProps } from "../types";
import { RouterAdapterComponent } from "./context";

export const createNextAdminComponents = (Adapter: RouterAdapterComponent) => {
  const NextAdmin = (props: AdminComponentProps & CustomUIProps) => {
    return (
      <Adapter>
        <NextAdminComponent {...props} />
      </Adapter>
    );
  };

  const MainLayout = (props: PropsWithChildren<MainLayoutProps>) => {
    return (
      <Adapter>
        <MainLayoutComponent {...props} />
      </Adapter>
    );
  };

  return {
    NextAdmin,
    MainLayout,
  };
};
