/* eslint-disable react-hooks/rules-of-hooks */
import { NextRouter, useRouter as usePageRouter } from "next/router";
import { useRouter as useAppRouter, useSearchParams } from "next/navigation";
import qs from "querystring";
import { useConfig } from "../context/ConfigContext";

type AppRouter = ReturnType<typeof useAppRouter>;

type PushParams = {
  pathname: string;
  query?: Record<string, string | string[] | number>;
};

export const useRouterInternal = () => {
  const { isAppDir } = useConfig();

  const router = isAppDir ? useAppRouter() : usePageRouter();
  const query = isAppDir
    ? useSearchParams()
    : new URLSearchParams(qs.stringify((router as NextRouter).query));

  const push = ({ pathname, query }: PushParams) => {
    if (isAppDir) {
      (router as AppRouter).push(`${pathname}?${qs.stringify(query)}`);
    } else {
      (router as NextRouter).push({ pathname, query });
    }
  };

  return { router: { push }, query: Object.fromEntries(query) };
};
