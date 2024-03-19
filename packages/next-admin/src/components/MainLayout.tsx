import { merge } from "lodash";
import { PropsWithChildren } from "react";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";
import { MainLayoutProps } from "../types";
import Menu from "./Menu";
import Message from "./Message";

type Props = MainLayoutProps;

export const MainLayout = ({
  resource,
  resources,
  resourcesTitles,
  customPages,
  basePath,
  message,
  error,
  children,
  isAppDir,
  locale,
  translations,
  title = "Admin",
  sidebar,
  resourcesIcons,
}: PropsWithChildren<Props>) => {
  const mergedTranslations = merge({ ...defaultTranslations }, translations);
  const localePath = locale ? `/${locale}` : "";

  return (
    <ConfigProvider basePath={`${localePath}${basePath}`} isAppDir={isAppDir}>
      <I18nProvider translations={mergedTranslations}>
        <div className="w-full">
          <Menu
            resources={resources}
            resource={resource}
            resourcesTitles={resourcesTitles}
            customPages={customPages}
            configuration={sidebar}
            resourcesIcons={resourcesIcons}
          />
          <main className="lg:pl-72">
            <div>
              {message && (
                <Message message={message.content} type={message.type} />
              )}
              {error && <Message message={error} type="error" />}
              {children}
            </div>
          </main>
        </div>
      </I18nProvider>
    </ConfigProvider>
  );
};
