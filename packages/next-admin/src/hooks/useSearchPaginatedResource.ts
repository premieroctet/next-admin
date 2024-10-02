import { useEffect, useRef, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { Enumeration } from "../types";

type UseSearchPaginatedResourceParams = {
  fieldName: string;
  initialOptions?: Enumeration[];
};

const useSearchPaginatedResource = ({
  fieldName,
  initialOptions,
}: UseSearchPaginatedResourceParams) => {
  const [isPending, setIsPending] = useState(false);
  const { apiBasePath, schema, resource } = useConfig();
  const searchPage = useRef(1);
  const totalSearchedItems = useRef(0);
  const [allOptions, setAllOptions] = useState<Enumeration[]>(
    initialOptions ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(false);

  const runSearch = async (query: string, resetOptions = true) => {
    const perPage = 25;

    const schemaResourceProperties = schema.definitions[resource!].properties;

    const schemaFieldEntry = Object.entries(schemaResourceProperties).find(
      ([key]) => key === fieldName
    );

    if (!schemaFieldEntry) {
      return;
    }

    const [, schemaField] = schemaFieldEntry;

    const model = schemaField.__nextadmin?.type;

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
          model,
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
