import { MainLayout } from "../components/MainLayout";
import {
  GetNextAdminParams,
  MainLayoutComponentProps,
  PageProps,
} from "../types";
import { getMainLayoutProps } from "./props";

export const getNextAdmin = ({
  options,
  basePath,
  apiBasePath,
}: GetNextAdminParams) => {
  const mainLayoutProps = getMainLayoutProps({
    options,
    basePath,
    apiBasePath,
  });

  return {
    Component: ({ params, searchParams }: PageProps & { translations: any }) =>
      null,
    Layout: (args: MainLayoutComponentProps) => (
      <MainLayout {...mainLayoutProps} {...args} />
    ),
  };
};
