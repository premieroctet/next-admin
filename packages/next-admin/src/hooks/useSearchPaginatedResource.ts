import { useEffect, useRef, useState } from "react";
import { useForm } from "../context/FormContext";
import { DataEnumeration, Enumeration, ModelName } from "../types";
import { useConfig } from "../context/ConfigContext";

type UseSearchPaginatedResourceParams = {
  resourceName: string;
  initialOptions?: Enumeration[] | DataEnumeration[];
};

const useSearchPaginatedResource = ({
  resourceName,
  initialOptions,
}: UseSearchPaginatedResourceParams) => {
  const [isPending, setIsPending] = useState(false);
  const { dmmfSchema, searchPaginatedResourceAction, resource } = useForm();
  const { isAppDir, basePath } = useConfig();
  const searchPage = useRef(1);
  const totalSearchedItems = useRef(0);
  const [allOptions, setAllOptions] = useState<
    Enumeration[] | DataEnumeration[]
  >(initialOptions ?? []);
  const [hasNextPage, setHasNextPage] = useState(false);

  const runSearch = async (query: string, resetOptions = true) => {
    const perPage = 25;

    const fieldFromDmmf = dmmfSchema?.find(
      (model) => model.name === resourceName
    );

    if (!fieldFromDmmf) {
      return;
    }

    const model = fieldFromDmmf.type;

    try {
      setIsPending(true);
      if (isAppDir) {
        const response = await searchPaginatedResourceAction?.({
          originModel: resource!,
          property: resourceName,
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

            return [...old, ...response.data] as
              | Enumeration[]
              | DataEnumeration[];
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
            property: resourceName,
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
