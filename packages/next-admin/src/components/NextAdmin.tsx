import Head from "next/head";
import { AdminComponentProps, CustomUIProps } from "../types";
import { getSchemaForResource } from "../utils/jsonSchema";
import { getCustomInputs } from "../utils/options";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import { MainLayout } from "./MainLayout";
import PageLoader from "./PageLoader";

// Components
export function NextAdmin({
  basePath,
  apiBasePath,
  data,
  resource,
  schema,
  resources,
  slug,
  total,
  dmmfSchema,
  dashboard,
  validation,
  isAppDir,
  options,
  resourcesTitles,
  resourcesIdProperty,
  customInputs: customInputsProp,
  customPages,
  actions: actionsProp,
  translations,
  locale,
  title,
  sidebar,
  resourcesIcons,
  user,
  externalLinks,
}: AdminComponentProps & CustomUIProps) {
  if (!isAppDir && !options) {
    throw new Error(
      "You must provide the options prop when using next-admin with page router"
    );
  }

  const actions =
    actionsProp || (resource ? options?.model?.[resource]?.actions : undefined);

  const modelSchema =
    resource && schema ? getSchemaForResource(schema, resource) : undefined;

  const resourceTitle = resourcesTitles?.[resource!] ?? resource;
  const resourceIcon = resourcesIcons?.[resource!];

  const renderMainComponent = () => {
    if (Array.isArray(data) && resource && typeof total != "undefined") {
      return (
        <List
          key={resource}
          resource={resource}
          data={data}
          total={total}
          title={resourceTitle!}
          resourcesIdProperty={resourcesIdProperty!}
          actions={actions}
          icon={resourceIcon}
        />
      );
    }

    if ((data && !Array.isArray(data)) || (modelSchema && !data)) {
      const customInputs = isAppDir
        ? customInputsProp
        : getCustomInputs(resource!, options!);

      return (
        <Form
          data={data}
          slug={slug}
          schema={modelSchema}
          dmmfSchema={dmmfSchema!}
          resource={resource!}
          validation={validation}
          title={resourceTitle!}
          customInputs={customInputs}
          actions={actions}
          icon={resourceIcon}
          resourcesIdProperty={resourcesIdProperty!}
        />
      );
    }

    if (resources) {
      if (dashboard && typeof dashboard === "function") return dashboard();
      return dashboard || <Dashboard resources={resources} />;
    }
  };

  return (
    <>
      <PageLoader />
      {!isAppDir && (
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      )}
      <MainLayout
        resource={resource}
        resources={resources}
        resourcesTitles={resourcesTitles}
        customPages={customPages}
        basePath={basePath}
        apiBasePath={apiBasePath}
        isAppDir={isAppDir}
        translations={translations}
        locale={locale}
        title={title}
        sidebar={sidebar}
        resourcesIcons={resourcesIcons}
        user={user}
        externalLinks={externalLinks}
        options={options}
        dmmfSchema={dmmfSchema}
        resourcesIdProperty={resourcesIdProperty!}
      >
        {renderMainComponent()}
      </MainLayout>
    </>
  );
}
