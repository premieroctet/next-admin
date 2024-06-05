"use client";

import { NextAdminProps } from "../types";
import MainLayout from "./MainLayout";
import PageLoader from "./PageLoader";

// Components
export function NextAdmin({
  basePath,
  apiBasePath,
  options,
  locale,
  user,
  params,
  translations,
  resource,
  resources,
  resourcesTitles,
  customPages,
  title,
  sidebar,
  resourcesIcons,
  externalLinks,
}: NextAdminProps) {
  // const modelSchema =
  //   resource && schema ? getSchemaForResource(schema, resource) : undefined;

  // const resourceTitle = resourcesTitles?.[resource!] ?? resource;
  // const resourceIcon = resourcesIcons?.[resource!];

  // console.log(params)
  // const routeRegex = parse("/:resource/:id")
  // console.log(routeRegex)
  // const routeObj = exec(params ?? [], routeRegex)
  // console.log(routeObj)
  // console.log(resources)
  // const ar = ["a", "b", "c"]
  // const matching =  match(routeObj)
  // .with({resource: P.when(resource=> resource && models.map(model=> model.name).includes(resource))}, ({resource}: {resource: ModelName}) => (<List
  //   key={resource}
  //   resource={resource}
  //   data={[]}
  //   total={0}
  //   title={resourceTitle!}
  //   resourcesIdProperty={resourcesIdProperty!}
  //   actions={actions}
  //   icon={resourceIcon}
  // />))
  // .with({resource, id: P.string}, ({resource, id}) => {
  //   const customInputs = isAppDir
  //   ? customInputsProp
  //   : getCustomInputs(resource!, options!);

  //   return (<Form
  //   data={data}
  //   slug={id}
  //   schema={modelSchema}
  //   dmmfSchema={dmmfSchema!}
  //   resource={resource!}
  //   validation={validation}
  //   title={resourceTitle!}
  //   customInputs={customInputs}
  //   actions={actions}
  //   icon={resourceIcon}
  //   resourcesIdProperty={resourcesIdProperty!}
  // />)})
  // .otherwise(() => {
  //   if (dashboard && typeof dashboard === "function") return dashboard();
  //     return dashboard || <Dashboard resources={resources!} />;
  // });

  const mainLayoutProps = {
    basePath,
    apiBasePath,
    options,
    user,
    locale,
    resource,
    resources,
    resourcesTitles,
    customPages,
    title,
    sidebar,
    resourcesIcons,
    externalLinks,
  };

  return (
    <>
      <PageLoader />
      {/* {!isAppDir && (
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      )} */}

      <MainLayout {...mainLayoutProps}></MainLayout>
    </>
  );
}
