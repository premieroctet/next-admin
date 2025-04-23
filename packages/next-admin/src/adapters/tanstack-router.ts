import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { PushParams, Query, RouterInterface } from "./types";
import { createRouterAdapter } from "./context";
import { useMemo } from "react";
import { useConfig } from "../context/ConfigContext";

export const useTanstackRouterAdapter = (): RouterInterface => {
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const { basePath } = useConfig();

  const pathname = location.pathname;
  const query = useMemo(() => {
    return new URLSearchParams(location.searchStr);
  }, [location.searchStr]);

  const push = (params: PushParams) => {
    navigate({
      to: ".",
      params: {
        _splat: params.pathname.replace(basePath, ""),
      },
      search: query ? params.query : undefined,
    });
  };

  const replace = (params: PushParams) => {
    navigate({
      to: ".",
      params: {
        _splat: params.pathname.replace(basePath, ""),
      },
      search: query ? params.query : undefined,
      replace: true,
    });
  };
  const refresh = () => {
    router.invalidate();
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

    window.location.search = searchParams.toString();
  };

  return {
    router: { push, replace, refresh, setQuery },
    pathname,
    query: Object.fromEntries(query),
  };
};

export const NextAdminRouterAdapter = createRouterAdapter(
  useTanstackRouterAdapter
);
