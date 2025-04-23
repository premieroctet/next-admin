export type Query = Record<string, string | string[] | number | null>;

export type PushParams = {
  pathname: string;
  query?: Query;
};

type Router = {
  push: (params: PushParams) => void;
  replace: (params: PushParams) => void;
  refresh: () => void;
  setQuery: (query: Query, merge?: boolean) => void;
};

export type RouterInterface = {
  router: Router;
  query: Record<string, string>;
  pathname: string;
};
