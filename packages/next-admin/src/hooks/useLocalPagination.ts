import { useMemo, useState } from "react";

const useLocalPagination = <T extends unknown>(
  data: T[],
  pageSize?: number
) => {
  const [pageIndex, setPageIndex] = useState(0);

  const dataToRender = useMemo(() => {
    if (!pageSize) {
      return data;
    }

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, pageIndex, pageSize]);

  const totalPages = useMemo(() => {
    if (!pageSize) {
      return 1;
    }
    return Math.ceil(data.length / pageSize);
  }, [data, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

  return {
    dataToRender,
    totalPages,
    handlePageChange,
    pageIndex,
  };
};

export default useLocalPagination;
