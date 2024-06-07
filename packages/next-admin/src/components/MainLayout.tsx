"use client";

import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutProps } from "../types";
import Menu from "./Menu";

export function MainLayout({
  basePath,
  apiBasePath,
  locale,
  options,
  children,
  user,
  resource,
  resources,
  resourcesTitles,
  customPages,
  title,
  sidebar,
  resourcesIcons,
  externalLinks,
  translations,
}: PropsWithChildren<MainLayoutProps>) {
  const mergedTranslations = merge({ ...defaultTranslations }, translations);
  const localePath = locale ? `/${locale}` : "";
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
