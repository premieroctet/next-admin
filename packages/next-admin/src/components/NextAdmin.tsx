import Head from "next/head";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import { AdminComponentProps, CustomUIProps } from "../types";
import { getSchemaForResource } from "../utils/jsonSchema";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import Menu from "./Menu";
import Message from "./Message";
import { ConfigProvider } from "../context/ConfigContext";

// Components
export function NextAdmin({
  basePath,
  data,
  resource,
  schema,
  resources,
  message,
  error,
  total,
  dmmfSchema,
  dashboard,
  options,
  validation,
}: AdminComponentProps & CustomUIProps) {
  const modelSchema =
    resource && schema ? getSchemaForResource(schema, resource) : undefined;

  const renderMainComponent = () => {
    if (Array.isArray(data) && resource && typeof total != "undefined") {
      return (
        <List
          key={resource}
          resource={resource}
          data={data}
          total={total}
          options={options?.model && options?.model[resource]}
        />
      );
    }

    if ((data && !Array.isArray(data)) || (modelSchema && !data)) {
      return (
        <Form
          data={data}
          schema={modelSchema}
          dmmfSchema={dmmfSchema}
          resource={resource}
          validation={validation}
        />
      );
    }

    if (resources) {
      if (dashboard && typeof dashboard === "function") return dashboard();
      return dashboard || <Dashboard />;
    }
  };

  return (
    <ConfigProvider basePath={basePath}>
      <NextNProgress color="#6366f1" />
      <Head>
        <title>Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Menu resources={resources} resource={resource} />

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
            {renderMainComponent()}
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}
