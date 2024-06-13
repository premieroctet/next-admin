import { PropsWithChildren } from "react";
import { MainLayout } from "../components/MainLayout";
import { NextAdmin } from "../components/NextAdmin";
import { GetNextAdminPropsParams } from "../types";
import { getMainLayoutProps, getNextAdminProps } from "./props";

export const getNextAdmin = (args: GetNextAdminPropsParams) => {
  const mainLayoutProps = getMainLayoutProps(args);
  const nextAdminProps = getNextAdminProps(args);

  return {
    Component: () => <NextAdmin {...nextAdminProps} />,
    Layout: ({ children }: PropsWithChildren) => (
      <MainLayout {...mainLayoutProps}>{children}</MainLayout>
    ),
  };
};
