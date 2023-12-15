import { PropsWithChildren } from "react";
import Link from "next/link";
import { MainLayoutProps } from "../types";
import Menu from "./Menu";
import Message from "./Message";
import { ConfigProvider } from "../context/ConfigContext";

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
}: PropsWithChildren<Props>) => {
  return (
    <ConfigProvider basePath={basePath} isAppDir={isAppDir}>
      <div className="w-full">
        <Menu
          resources={resources}
          resource={resource}
          resourcesTitles={resourcesTitles}
          customPages={customPages}
        />

        <main className="py-10 lg:pl-72">
          <div className="px-3 sm:px-10 lg:px-18 space-y-4">
            {message && (
              <Message message={message.content} type={message.type} />
            )}
            {error && <Message message={error} type="error" />}
            {children}
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
};
