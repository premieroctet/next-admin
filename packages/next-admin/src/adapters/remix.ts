import { useLocation, useNavigate, useRevalidator } from "@remix-run/react";
import { useMemo } from "react";
import { createNextAdminComponents } from "./components";
import { createRouterAdapter } from "./context";
import { PushParams, Query, RouterInterface } from "./types";

export const useRemixRouterAdapter = (): RouterInterface => {
  const location = useLocation();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const pathname = location.pathname;
  const query = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const push = (params: PushParams) => {
    navigate({
      pathname: params.pathname,
      search: params.query
        ? new URLSearchParams(params.query as Record<string, string>).toString()
        : undefined,
    });
  };

  const replace = (params: PushParams) => {
    navigate(
      {
        pathname: params.pathname,
        search: params.query
          ? new URLSearchParams(
              params.query as Record<string, string>
            ).toString()
          : undefined,
      },
      {
        replace: true,
      }
    );
  };

  const refresh = () => {
    revalidator.revalidate();
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
  useRemixRouterAdapter
);

const { NextAdmin, MainLayout } = createNextAdminComponents(
  NextAdminRouterAdapter
);

export { MainLayout, NextAdmin };
