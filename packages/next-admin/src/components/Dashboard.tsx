"use client";
import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { ModelName } from "../types";

export type DashboardProps = {
  resources: ModelName[];
};

const Dashboard = ({ resources }: DashboardProps) => {
  const { basePath } = useConfig();
  const { router } = useRouterInternal();

  router.replace({
    pathname: `${basePath}/${resources[0]}`,
  });

  return null;
};

export default Dashboard;
