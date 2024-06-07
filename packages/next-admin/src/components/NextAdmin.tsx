"use client";
import { match, P } from "ts-pattern";
import { ModelName, NextAdminProps } from "../types";
import List from "./List";
import { MainLayout } from "./MainLayout";
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
  const matching = match(params)
    .with(
      [
        P.when(
          (resourceName): resourceName is ModelName =>
            !!resource && resourceName === resource
        ),
      ],
      ([resource]) => {
        const resourceTitle = resourcesTitles?.[resource] ?? resource;
        const resourceIcon = resourcesIcons?.[resource];
        const resourcesIdProperty = resources!.reduce(
          (acc, resource) => {
            acc[resource] = "id";
            return acc;
          },
          {} as Record<ModelName, string>
        );
        return (
          <List
            key={resource}
            resource={resource}
            data={[]}
            total={0}
            title={resourceTitle!}
            resourcesIdProperty={resourcesIdProperty!}
            icon={resourceIcon}
          />
        );
      }
    )
    .with([P.string, P.string], (_, id) => {
      return <div>Resource: {resource} Form</div>;
    })
    .otherwise(() => {
      return <div>No resource</div>;
    });

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
    translations,
  };

  return (
    <>
      <PageLoader />
      <MainLayout {...mainLayoutProps}>{matching}</MainLayout>
    </>
  );
}
