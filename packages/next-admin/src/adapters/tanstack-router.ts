import { useLocation, useNavigate } from "@tanstack/react-router";
import { PushParams, Query, RouterInterface } from "./types";
import { createRouterAdapter } from "./context";

export const useTanstackRouterAdapter = (): RouterInterface => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const query = new URLSearchParams(location.searchStr);

  const push = (params: PushParams) => {
    navigate({
      to: ".",
      params: {
        _splat: params.pathname,
      },
      search: query
        ? new URLSearchParams(params.query as Record<string, string>).toString()
        : undefined,
    });
  };

  const replace = (params: PushParams) => {
    navigate({
      to: ".",
      params: {
        _splat: params.pathname,
      },
      search: query
        ? new URLSearchParams(params.query as Record<string, string>).toString()
        : undefined,
      replace: true,
    });
  };
  const refresh = () => {
    navigate({
      to: ".",
      replace: true,
    });
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

    navigate({
      to: ".",
      replace: true,
      search: searchParams,
    });
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
