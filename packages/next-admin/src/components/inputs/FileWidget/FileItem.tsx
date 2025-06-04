import { useEffect, useMemo, useState } from "react";
import { getFilenameFromUrl } from "../../../utils/file";
import clsx from "clsx";
import Loader from "../../../assets/icons/Loader";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  file: string | File;
  hasError: boolean;
  onDelete: () => void;
  disabled: boolean;
};

const FileItem = ({ file, hasError, onDelete, disabled }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const [fileIsImage, setFileIsImage] = useState(true);
  const [filename, setFilename] = useState<string | null>(() => {
    if (file instanceof File) {
      return file.name;
    }

    return null;
  });
  const fileUri = useMemo(() => {
    if (typeof file === "string") {
      return file;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (fileUri) {
      setIsPending(true);

      const image = document.createElement("img");
      image.src = fileUri;
      image.onload = () => {
        setFileIsImage(true);
        setIsPending(false);
      };
      image.onerror = (e) => {
        setFileIsImage(false);
        setIsPending(false);
      };
      const name = getFilenameFromUrl(fileUri);
      if (!filename && name) {
        setFilename(name);
      }
      setIsPending(false);
    } else {
      setIsPending(false);
    }
  }, [fileUri]);

  return (
    <div
      className={clsx(
        "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-default relative flex cursor-default items-center justify-between rounded-md px-3 px-8 py-2 text-sm placeholder-gray-500 shadow-sm ring-1",
        { "ring-red-600 dark:ring-red-400": hasError }
      )}
    >
      <a
        href={fileUri ?? undefined}
        className="relative flex flex-1 cursor-pointer flex-col items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {isPending && (
          <div className="flex h-10 w-10 items-center justify-center">
            <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-6 w-6 animate-spin dark:stroke-gray-300" />
          </div>
        )}

        {!isPending &&
          (fileIsImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fileUri} alt="file" className="h-32" />
          ) : (
            <DocumentIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-10 w-10" />
          ))}

        {!!filename && (
          <span className="text-nextadmin-content-inverted/50 dark:text-dark-nextadmin-content-inverted/50 text-sm">
            {filename}
          </span>
        )}
      </a>
      {!isPending && (
        <div onClick={onDelete} className={clsx({ hidden: disabled })}>
          <XMarkIcon className="absolute right-2 top-2 h-5 w-5 cursor-pointer text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default FileItem;
