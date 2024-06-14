import { PropsWithChildren } from "react";
import { MainLayout } from "../components/MainLayout";
import { NextAdmin } from "../components/NextAdmin";
import { GetNextAdminParams } from "../types";
import { getMainLayoutProps, getNextAdminProps } from "./props";

export const getNextAdmin = ({
  prisma,
  schema,
  ...args
}: GetNextAdminParams) => {
  const mainLayoutProps = getMainLayoutProps(args);
  const nextAdminProps = getNextAdminProps(args);

  return {
    Component: ({
      params,
      searchParams,
    }: {
      params: { [key: string]: string[] | string };
      searchParams:
        | { [key: string]: string | string[] | undefined }
        | undefined;
    }) => <NextAdmin {...nextAdminProps} />,
    Layout: ({ children }: PropsWithChildren) => (
      <MainLayout {...mainLayoutProps}>{children}</MainLayout>
    ),
  };
};
