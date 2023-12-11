import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import { AdminComponentProps, CustomUIProps } from "../types";
import { getSchemaForResource } from "../utils/jsonSchema";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import { getCustomInputs } from "../utils/options";
import { MainLayout } from "./MainLayout";

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
  validation,
  isAppDir,
  action,
  options,
  resourcesTitles,
  resourcesIdProperty,
  customInputs: customInputsProp,
  customPages,
  actions: actionsProp,
  deleteAction,
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

  const renderMainComponent = () => {
    if (Array.isArray(data) && resource && typeof total != "undefined") {
      return (
        <List
          key={resource}
          resource={resource}
          data={data}
          total={total}
          options={options?.model && options?.model[resource]}
          title={resourceTitle!}
          resourcesIdProperty={resourcesIdProperty!}
          actions={actions}
          deleteAction={deleteAction}
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
          schema={modelSchema}
          dmmfSchema={dmmfSchema!}
          resource={resource!}
          validation={validation}
          action={action}
          title={resourceTitle!}
          customInputs={customInputs}
          actions={actions}
        />
      );
    }

    if (resources) {
      if (dashboard && typeof dashboard === "function") return dashboard();
      return dashboard || <Dashboard />;
    }
  };

  return (
    <>
      {!isAppDir && <NextNProgress color="#6366f1" />}
      <Head>
        <title>Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout
        resource={resource}
        resources={resources}
        resourcesTitles={resourcesTitles}
        customPages={customPages}
        basePath={basePath}
        message={message}
        error={error}
        isAppDir={isAppDir}
      >
        {renderMainComponent()}
      </MainLayout>
    </>
  );
}
