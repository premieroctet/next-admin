import { PropsWithChildren } from "react";
import Link from "next/link";
import { MainLayoutProps, Translations } from "../types";
import Menu from "./Menu";
import Message from "./Message";
import { ConfigProvider } from "../context/ConfigContext";
import { I18nProvider } from "../context/I18nContext";
import { defaultTranslations } from "../i18n";

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
  translations,
}: PropsWithChildren<Props>) => {
  const mergedTranslations = Object.entries(translations ?? {}).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    },
    defaultTranslations
  );

  return (
    <ConfigProvider basePath={basePath} isAppDir={isAppDir}>
      <I18nProvider translations={mergedTranslations}>
        <div className="w-full">
          <Menu
            resources={resources}
            resource={resource}
            resourcesTitles={resourcesTitles}
            customPages={customPages}
          />

          <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-12 lg:px-20 space-y-4">
              <h1>
                <Link
                  className="text-neutral-500 hover:text-neutral-700 hover:underline cursor-pointer"
                  href={basePath}
                >
                  Admin
                </Link>
              </h1>
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
