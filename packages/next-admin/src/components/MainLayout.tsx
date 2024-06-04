import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutProps } from "../types";
import { getMainLayoutProps } from "../utils/props";
import Menu from "./Menu";

type Props = MainLayoutProps;

export const MainLayout = ({
  basePath,
  apiBasePath,
  locale,
  params,
  options,
  children,
  user,
}: PropsWithChildren<Props>) => {
  const mergedTranslations = merge({ ...defaultTranslations }, {/* TODO: Restore translations */});
  const localePath = locale ? `/${locale}` : "";
  const {
    resource,
    resources,
    resourcesTitles,
    customPages,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
    serializedOptions,
  } = getMainLayoutProps({ options, params });

  console.log(resourcesTitles);

  return (
    <ConfigProvider
      options={serializedOptions}
      basePath={`${localePath}${basePath}`}
      apiBasePath={apiBasePath}
    >
      <I18nProvider translations={mergedTranslations}>
        <ColorSchemeProvider>
          <div className="next-admin__root">
            <Menu
              title={title}
              resources={resources}
              resource={resource}
              resourcesTitles={resourcesTitles}
              customPages={customPages}
              sidebar={sidebar}
              resourcesIcons={resourcesIcons}
              user={user}
              externalLinks={externalLinks}
              forceColorScheme={options?.forceColorScheme}
            />
            <main className="lg:pl-72">{children}</main>
          </div>
        </ColorSchemeProvider>
      </I18nProvider>
    </ConfigProvider>
  );
};
