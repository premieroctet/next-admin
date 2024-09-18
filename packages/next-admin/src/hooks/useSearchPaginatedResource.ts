import { useEffect, useRef, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { useResource } from "../context/ResourceContext";
import { Enumeration, Field, ModelName } from "../types";

type UseSearchPaginatedResourceParams = {
  fieldName: Field<ModelName>;
  initialOptions?: Enumeration[];
};

const useSearchPaginatedResource = ({
  fieldName,
  initialOptions,
}: UseSearchPaginatedResourceParams) => {
  const [isPending, setIsPending] = useState(false);
  const { apiBasePath } = useConfig();
  const { resource } = useResource();
  const searchPage = useRef(1);
  const totalSearchedItems = useRef(0);
  const [allOptions, setAllOptions] = useState<Enumeration[]>(
    initialOptions ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(false);
  const { modelSchema } = useResource();

  const runSearch = async (query: string, resetOptions = true) => {
    const perPage = 25;

    const relationModel =
      modelSchema?.properties[fieldName]?.relation ||
      modelSchema?.properties[fieldName]?.items?.relation;

    if (!relationModel) {
      return;
    }

    try {
      setIsPending(true);
      const response = await fetch(`${apiBasePath}/options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originModel: resource!,
          property: fieldName,
          model: relationModel,
          query,
          page: searchPage.current,
          perPage,
        }),
      });

      if (response.ok) {
        const responseJson = await response.json();

        if (!responseJson.error) {
          totalSearchedItems.current = responseJson.total;
          setAllOptions((old) => {
            if (resetOptions) {
              return responseJson.data;
            }

            return [...old, ...responseJson.data];
          });
        }
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (allOptions?.length > 0) {
      setHasNextPage(allOptions.length < totalSearchedItems.current);
    }
  }, [allOptions]);

  return {
    allOptions,
    setAllOptions,
    runSearch,
    searchPage,
    totalSearchedItems,
    isPending,
    hasNextPage,
  };
};

export default useSearchPaginatedResource;
