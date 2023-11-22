import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../radix/Button";

const FileWidget = (props: WidgetProps) => {
  const [fileInfo, setFileInfo] = useState<number | null>(
    props.value ? props.value : null
  );
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileIsImage, setFileIsImage] = useState(false);
  const [fileImage, setFileImage] = useState<string | null>(props.value);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const { size } = selectedFile;
      setFileInfo(size);

      if (selectedFile.type.includes("image")) {
        const reader = new FileReader();

        reader.onload = () => {
          setFileIsImage(true);
          setFileImage(reader.result as string);
        };

        reader.readAsDataURL(selectedFile);
      } else {
        setFileImage(null);
        setFileIsImage(false);
      }
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

  const getFileType = async (signal: AbortSignal) => {
    if (!props.value) {
      return;
    }
    try {
      const response = await fetch(props.value, {
        signal,
      });
      setFileIsImage(
        response.headers.get("Content-Type")?.includes("image") ?? false
      );
      setFileImage(props.value);
    } catch (error) {
      setFileIsImage(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    getFileType(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  let isLink = false;

  try {
    isLink = Boolean(new URL(props.value as string));
  } catch (error) {
    isLink = false;
  }

  return (
    <div className="relative">
      <div className="relative flex flex-col items-start py-1 gap-3">
        {fileInfo && (
          <div className="relative flex flex-col items-center space-x-2 gap-1">
            <div className="relative">
              {fileIsImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fileImage!} alt="file" className="h-32" />
              ) : (
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              )}
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
        <div className="flex items-center space-x-2">
          <Button
            className={clsx(
              "flex items-center shadow-sm ring-1 ring-gray-300 border-0 rounded-md hover:cursor-pointer"
            )}
            type="button"
            variant="ghost"
          >
            <label
              htmlFor={props.id}
              className="relative flex hover:cursor-pointer"
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
          </Button>
          {fileInfo && (
            <Button
              type="button"
              variant="destructive"
              className="flex items-center space-x-2"
              onClick={handleFileRemove}
            >
              <span className="text-sm font-medium">Remove</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileWidget;
