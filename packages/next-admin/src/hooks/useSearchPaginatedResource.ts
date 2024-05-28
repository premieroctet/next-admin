import { useEffect, useRef, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { useForm } from "../context/FormContext";
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
  const { dmmfSchema, searchPaginatedResourceAction, resource } = useForm();
  const { isAppDir, basePath, options } = useConfig();
  const searchPage = useRef(1);
  const totalSearchedItems = useRef(0);
  const [allOptions, setAllOptions] = useState<Enumeration[]>(
    initialOptions ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(false);

  const runSearch = async (query: string, resetOptions = true) => {
    const perPage = 25;

    const fieldFromDmmf = dmmfSchema?.find((field) => field.name === fieldName);

    if (!fieldFromDmmf) {
      return;
    }

    const model = fieldFromDmmf.type;

    try {
      setIsPending(true);
      if (isAppDir) {
        const response = await searchPaginatedResourceAction?.({
          originModel: resource!,
          property: fieldName,
          model,
          query,
          page: searchPage.current,
          perPage,
        });

        if (response && !response.error) {
          totalSearchedItems.current = response.total;
          setAllOptions((old) => {
            if (resetOptions) {
              return response.data;
            }

            return [...old, ...response.data] as Enumeration[];
          });
        }
      } else {
        const response = await fetch(`${basePath}/api/options`, {
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
