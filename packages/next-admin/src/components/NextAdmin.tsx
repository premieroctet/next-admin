import { merge } from "lodash";
import dynamic from "next/dynamic";
import { AdminComponentProps, CustomUIProps } from "../types";
import { getSchemaForResource } from "../utils/jsonSchema";
import { getCustomInputs } from "../utils/options";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import { MainLayout } from "./MainLayout";
import PageLoader from "./PageLoader";

const Head = dynamic(() => import("next/head"));

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
  actions,
  translations,
  locale,
  title,
  sidebar,
  resourcesIcons,
  user,
  externalLinks,
  serverOptions
}: AdminComponentProps & CustomUIProps) {
  if (!isAppDir && !options) {
    throw new Error(
      "You must provide the options prop when using next-admin with page router"
    );
  }

  const mergedOptions = merge(options, serverOptions);

  let mergedActions = merge(
    actions ?? [],
    resource ? mergedOptions?.model?.[resource]?.actions : []
  );

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
          actions={mergedActions}
          icon={resourceIcon}
          schema={schema!}
        />
      );
    }

    if ((data && !Array.isArray(data)) || (modelSchema && !data)) {
      const customInputs = isAppDir
        ? customInputsProp
        : getCustomInputs(resource!, mergedOptions!);

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
          actions={mergedActions}
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
        options={mergedOptions}
        dmmfSchema={dmmfSchema}
        resourcesIdProperty={resourcesIdProperty!}
      >
        {renderMainComponent()}
      </MainLayout>
    </>
  );
}
