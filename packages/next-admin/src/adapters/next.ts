"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import {
  useRouter as useAppRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { NextRouter, useRouter as usePageRouter } from "next/router";
import { useConfig } from "../context/ConfigContext";
import { PushParams, Query, RouterInterface } from "./types";
import { createRouterAdapter } from "./context";
import { createNextAdminComponents } from "./components";

type AppRouter = ReturnType<typeof useAppRouter>;

export const useNextRouter = (): RouterInterface => {
  const { isAppDir } = useConfig();

  const router = isAppDir ? useAppRouter() : usePageRouter();
  const query = isAppDir
    ? useSearchParams()
    : typeof window !== "undefined"
      ? new URLSearchParams(location.search)
      : new URLSearchParams(
          (router as NextRouter).query as Record<string, string>
        );
  const pathname = isAppDir
    ? usePathname()
    : (router as NextRouter).asPath.split("?")[0];

  const push = ({ pathname, query }: PushParams) => {
    if (isAppDir) {
      (router as AppRouter).push(
        pathname +
          (query
            ? "?" +
              new URLSearchParams(query as Record<string, string>).toString()
            : "")
      );
    } else {
      (router as NextRouter).push({ pathname, query });
    }
  };

  const replace = ({ pathname, query }: PushParams) => {
    if (isAppDir) {
      (router as AppRouter).replace(
        pathname +
          (query
            ? "?" +
              new URLSearchParams(query as Record<string, string>).toString()
            : "")
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

  const setQuery = (queryArg: Query, merge = false) => {
    const currentQuery = Object.fromEntries(query);
    const newQuery = merge ? { ...currentQuery, ...queryArg } : queryArg;
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(newQuery)) {
      if (value) {
        searchParams.set(key, value as string);
      }
    }

    location.search = searchParams.toString();
  };

  return {
    router: { push, replace, refresh, setQuery },
    query: Object.fromEntries(query),
    pathname,
  };
};

export const NextAdminRouterAdapter = createRouterAdapter(useNextRouter);

const { NextAdmin, MainLayout } = createNextAdminComponents(
  NextAdminRouterAdapter
);

export { NextAdmin, MainLayout };
