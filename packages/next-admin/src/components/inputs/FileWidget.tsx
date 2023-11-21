import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, useRef, useState } from "react";

const FileWidget = (props: WidgetProps) => {
  const [fileInfo, setFileInfo] = useState<number | null>(
    props.value ? props.value : null
  );
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const { size } = selectedFile;
      setFileInfo(size);
    } else {
      setFileInfo(null);
    }
  };

  const handleFileRemove = () => {
    setHasChanged(true);
    setFileInfo(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  let isLink = false;

  try {
    isLink = Boolean(new URL(props.value as string));
  } catch (error) {
    isLink = false;
  }

  return (
    <div className="relative">
      <div className="relative flex flex-col items-start py-1 gap-4">
        {fileInfo && (
          <div className="relative flex flex-col items-center space-x-2 gap-1">
            <div className="relative">
              <DocumentIcon className="h-12 w-12 text-gray-400" />
              <XCircleIcon
                className="absolute -top-2 -right-2 h-5 w-5 text-red-700 cursor-pointer"
                onClick={handleFileRemove}
              />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              1 file selected
            </span>
            {isLink && (
              <a
                href={props.value}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.value}
              </a>
            )}
          </div>
        )}
        <div
          className={clsx(
            "flex items-center shadow-sm ring-1 ring-gray-300 border-0 rounded-md hover:cursor-pointer"
          )}
        >
          <label
            htmlFor={props.id}
            className="relative flex items-center justify-center py-2 px-3  rounded-md hover:cursor-pointer"
          >
            {fileInfo ? (
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Change
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CloudArrowUpIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Upload
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              id={props.id}
              name={hasChanged ? props.name : ""}
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileWidget;
