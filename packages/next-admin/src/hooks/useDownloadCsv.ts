import { useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "./useRouterInternal";

type UseDownloadCsvParams = {
  onExport?: () => Promise<string>;
};

export const useDownloadCsv = ({ onExport }: UseDownloadCsvParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAppDir } = useConfig();
  const { pathname } = useRouterInternal();

  const download = async () => {
    if (isAppDir && !onExport) {
      return;
    }

    setIsLoading(true);
    let blob = null;
    /**
     * Currently we only fetch the file from the server
     * if we are not using App Router.
     * On Page Router, the file is received as a Stream, which is
     * currently not supported with server actions. Such behavior will
     * be implemented in App Router as soon as its available.
     */
    try {
      if (isAppDir) {
        const content = await onExport!();
        blob = new Blob([content], { type: "text/csv" });
      } else {
        const response = await fetch(pathname + "?export=csv");
        blob = await response.blob();
      }

      if (blob) {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        element.download = "export.csv";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
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
