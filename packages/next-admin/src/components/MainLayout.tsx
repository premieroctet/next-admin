"use client";

import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutComponentProps, MainLayoutProps } from "../types";
import { getResourceFromParams } from "../utils/tools";
import Menu from "./Menu";

export const MainLayout =
  ({
    basePath,
    apiBasePath,
    options,
    resources,
    resourcesTitles,
    customPages,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
    locale,
    params,
    user,
    translations,
    children,
  }: PropsWithChildren<MainLayoutComponentProps & MainLayoutProps>) => {
    const mergedTranslations = merge({ ...defaultTranslations }, translations);
    const localePath = locale ? `/${locale}` : "";
    const resource = getResourceFromParams(
      params?.nextadmin as string[],
      resources
    );
    return (
      <ConfigProvider
        options={options}
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
