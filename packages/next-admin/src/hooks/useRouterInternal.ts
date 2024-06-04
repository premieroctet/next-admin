/* eslint-disable react-hooks/rules-of-hooks */
import {
  useRouter as useAppRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

type AppRouter = ReturnType<typeof useAppRouter>;

type Query = Record<string, string | string[] | number | null>;

type PushParams = {
  pathname: string;
  query?: Query;
};

export const useRouterInternal = () => {
  const router = useAppRouter();
  const query = useSearchParams();
  const pathname = usePathname();

  const push = ({ pathname, query }: PushParams) => {
    (router as AppRouter).push(
      pathname +
        (query
          ? "?" +
            new URLSearchParams(query as Record<string, string>).toString()
          : "")
    );
  };

  const replace = ({ pathname, query }: PushParams) => {
    (router as AppRouter).replace(
      pathname +
        (query
          ? "?" +
            new URLSearchParams(query as Record<string, string>).toString()
          : "")
    );
  };

  const refresh = () => {
    (router as AppRouter).refresh();
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
