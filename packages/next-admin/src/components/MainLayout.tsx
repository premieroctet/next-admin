import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutProps } from "../types";
import Menu from "./Menu";

type Props = MainLayoutProps;

export const MainLayout = ({
  resource,
  resources,
  resourcesTitles,
  customPages,
  basePath,
  children,
  isAppDir,
  locale,
  translations,
  sidebar,
  resourcesIcons,
  user,
  externalLinks,
  title,
  options,
}: PropsWithChildren<Props>) => {
  const mergedTranslations = merge({ ...defaultTranslations }, translations);
  const localePath = locale ? `/${locale}` : "";

  return (
    <ConfigProvider
      options={options}
      basePath={`${localePath}${basePath}`}
      isAppDir={isAppDir}
    >
      <I18nProvider translations={mergedTranslations}>
        <ColorSchemeProvider>
          <div className="next-admin__root h-[100vh] max-w-[100vw]">
            <Menu
              title={title}
              resources={resources}
              resource={resource}
              resourcesTitles={resourcesTitles}
              customPages={customPages}
              configuration={sidebar}
              resourcesIcons={resourcesIcons}
              user={user}
              externalLinks={externalLinks}
              forceColorScheme={options?.forceColorScheme}
            />
            <main className="h-full lg:pl-72">{children}</main>
          </div>
        </ColorSchemeProvider>
      </I18nProvider>
    </ConfigProvider>
  );
};
