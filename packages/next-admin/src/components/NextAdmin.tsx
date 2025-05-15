import merge from "lodash.merge";
import type { AdminComponentProps, CustomUIProps } from "../types";
import { getSchemaForResource } from "../utils/jsonSchema";
import { getClientActionsComponents, getCustomInputs } from "../utils/options";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import { MainLayout } from "./MainLayout";

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
  dashboard,
  validation,
  isAppDir,
  options,
  resourcesTitles,
  resourcesIdProperty,
  customInputs: customInputsProp,
  dialogComponents: dialogComponentsProp,
  customPages,
  actions,
  translations,
  locale,
  title,
  sidebar,
  resourcesIcons,
  user,
  externalLinks,
  pageLoader,
  rawData,
  relationshipsRawData,
  listFilterOptions,
}: AdminComponentProps & CustomUIProps) {
  if (!isAppDir && !options) {
    throw new Error(
      "You must provide the options prop when using next-admin with page router"
    );
  }

  let mergedActions = merge(
    actions ?? [],
    resource ? options?.model?.[resource]?.actions : []
  );

  const modelSchema =
    resource && schema ? getSchemaForResource(schema, resource) : undefined;

  const resourceTitle = resourcesTitles?.[resource!] ?? resource;
  const resourceIcon = resourcesIcons?.[resource!];
  const dialogComponents = resource
    ? isAppDir
      ? dialogComponentsProp
      : getClientActionsComponents(resource, options)
    : undefined;

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
          clientActionsComponents={dialogComponents}
          rawData={rawData!}
          listFilterOptions={listFilterOptions}
        />
      );
    }

    if ((data && !Array.isArray(data)) || (modelSchema && !data)) {
      const customInputs = isAppDir
        ? customInputsProp
        : getCustomInputs(resource!, options);

      return (
        <Form
          data={data}
          slug={slug}
          schema={modelSchema}
          resource={resource!}
          validation={validation}
          title={resourceTitle!}
          customInputs={customInputs}
          actions={mergedActions}
          icon={resourceIcon}
          resourcesIdProperty={resourcesIdProperty!}
          clientActionsComponents={dialogComponents}
          relationshipsRawData={relationshipsRawData}
        />
      );
    }

    if (resources) {
      if (dashboard && typeof dashboard === "function") return dashboard();
      return dashboard || <Dashboard resources={resources} />;
    }
  };

  const titleElement = isAppDir ? title : options?.title;

  return (
    <>
      {pageLoader}
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
        title={titleElement}
        sidebar={sidebar}
        resourcesIcons={resourcesIcons}
        user={user}
        externalLinks={externalLinks}
        options={options}
        resourcesIdProperty={resourcesIdProperty!}
        schema={schema}
      >
        {renderMainComponent()}
      </MainLayout>
    </>
  );
}
