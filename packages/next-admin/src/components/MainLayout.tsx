"use client";

import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutProps, PageProps } from "../types";
import Menu from "./Menu";
import { getResourceFromParams } from "../utils/tools";

export function MainLayout({
  basePath,
  apiBasePath,
  options,
  children,
  user,
  resources,
  resourcesTitles,
  customPages,
  title,
  sidebar,
  resourcesIcons,
  externalLinks,
  translations,
  params,
}: PropsWithChildren<MainLayoutProps & PageProps>) {
  const mergedTranslations = merge({ ...defaultTranslations }, translations);
  const localePath = params?.locale ? `/${params?.locale}` : "";
  const resource = getResourceFromParams(params?.nextadmin as string[], resources);
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
}
