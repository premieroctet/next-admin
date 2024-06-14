import { PropsWithChildren } from "react";
import { MainLayout } from "../components/MainLayout";
import { NextAdmin } from "../components/NextAdmin";
import { GetNextAdminParams, PageProps } from "../types";
import { getMainLayoutProps, getNextAdminProps } from "./props";

export const getNextAdmin = ({
  prisma,
  schema,
  ...args
}: GetNextAdminParams) => {
  console.log(args.translations);
  const mainLayoutProps = getMainLayoutProps(args);
  const nextAdminProps = getNextAdminProps(args);

  return {
    Component: ({ params, searchParams }: PageProps & {translations: any}) => (
      <NextAdmin {...nextAdminProps} />
    ),
    Layout: ({ children, ...props }: PropsWithChildren<PageProps>) => (
      <MainLayout {...mainLayoutProps} {...props}>
        {children}
      </MainLayout>
    ),
  };
};
