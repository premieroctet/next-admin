/* eslint-disable react-hooks/rules-of-hooks */
import { NextRouter, useRouter as usePageRouter } from "next/router";
import {
  useRouter as useAppRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
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
      (router as AppRouter).push(
        pathname + (query ? "?" + qs.stringify(query) : "")
      );
    } else {
      (router as NextRouter).push({ pathname, query });
    }
  };

  const replace = ({ pathname, query }: PushParams) => {
    if (isAppDir) {
      (router as AppRouter).replace(
        pathname + (query ? "?" + qs.stringify(query) : "")
      );
    } else {
      (router as NextRouter).replace({ pathname, query });
    }
  };

  const refresh = () => {
    if (isAppDir) {
      (router as AppRouter).refresh();
    } else {
      (router as NextRouter).replace((router as NextRouter).asPath);
    }
  };

  return {
    router: { push, replace, refresh },
    query: Object.fromEntries(query),
    pathname: isAppDir
      ? usePathname()
      : (router as NextRouter).asPath.split("?")[0],
  };
};
