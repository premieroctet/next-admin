"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { FilterWrapper, ModelName } from "../types";
import Badge from "./Badge";

type FiltersProps<T extends ModelName> = {
  filters?: FilterWrapper<T>[];
} & React.HTMLAttributes<HTMLDivElement>;

const Filters = <T extends ModelName>({
  filters,
  ...props
}: FiltersProps<T>) => {
  const { router, query } = useRouterInternal();

  const fetchUrlFilter = () => {
    try {
      if (query?.filters) {
        const urlFilter = JSON.parse(query.filters) as string[];
        return filters?.map((filter) => ({
          ...filter,
          active: urlFilter.includes(filter.name),
        }));
      } else {
        return filters;
      }
    } catch {
      return filters;
    }
  };

  const [currentFilters, setCurrentFilters] = useState(fetchUrlFilter);

  useEffect(() => {
    setCurrentFilters(fetchUrlFilter());
  }, [query?.filters]);

  const toggleFilter = (name: string) => {
    router?.push({
      pathname: location.pathname,
      query: {
        ...query,
        page: 1,
        filters: JSON.stringify(
          currentFilters
            ?.map((filter) => ({
              ...filter,
              active: filter.name === name ? !filter.active : filter.active,
            }))
            .filter((filter) => filter.active)
            .map((filter) => filter.name)
        ),
      },
    });
  };

  return (
    currentFilters && (
      <div {...props} className={clsx("flex flex-wrap gap-2", props.className)}>
        {currentFilters.map(({ name, active }) => (
          <Badge
            onClick={() => toggleFilter(name)}
            name={name}
            key={name}
            isActive={active}
          />
        ))}
      </div>
    )
  );
};
export default Filters;
