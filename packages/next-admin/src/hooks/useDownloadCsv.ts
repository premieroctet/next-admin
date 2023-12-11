import { useState } from "react";

type UseDownloadCsvParams = {
  onExport?: () => Promise<string>;
};

export const useDownloadCsv = ({ onExport }: UseDownloadCsvParams) => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async () => {
    if (!onExport) {
      return;
    }

    setIsLoading(true);
    try {
      const csvContent = await onExport();

      const element = document.createElement("a");
      const file = new Blob([csvContent], { type: "text/csv" });
      element.href = URL.createObjectURL(file);
      element.download = "export.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error("Export error", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    download,
    isLoading,
  };
};
