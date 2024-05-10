import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "../../context/I18nContext";

const FileWidget = (props: WidgetProps) => {
  const [file, setFile] = useState<File>();
  const [fileIsImage, setFileIsImage] = useState(false);
  const [fileData, setFileData] = useState<string | null>(props.value);

  const inputRef = useRef<HTMLInputElement>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files;
    if (selectedFile) {
      setHasChanged(true);
      setFile(selectedFile[0]);
    }
  };

  useEffect(() => {
    if (props.value) {
      fetch(props.value)
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          setFile(new File([blob], blob.name, { type: blob.type }));
        });
    }
  }, []);

  const handleDelete = () => {
    setFile(undefined);
  };

  const handleDrop = (event: React.DragEvent) => {
    if (!props.disabled) {
      event.preventDefault();
      setFile(event.dataTransfer?.files[0]);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (inputRef?.current) {
      const dataTransfer = new DataTransfer();
      if (file) {
        dataTransfer.items.add(file);
        const reader = new FileReader();
        reader.onload = () => {
          setFileIsImage(file.type.includes("image"));
          if (hasChanged) {
            setFileData(reader.result as string);
          }
        };

        reader.readAsDataURL(file);
      }
      inputRef.current.files = dataTransfer.files;
    }
  }, [file]);

  return (
    <div className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted relative flex flex-col items-start space-y-2">
      {
        <div
          className={clsx(
            "border-nextadmin-border-default dark:border-dark-nextadmin-border-default hover:bg-dark-nextadmin-background-subtle relative flex w-full justify-center rounded-lg border-2 border-dashed px-6 py-10",
            {
              "bg-dark-nextadmin-background-subtle": isDragging,
              "opacity-50": props.disabled,
            },
            file && "hidden"
          )}
          onDrop={handleDrop}
          onDragOver={(evt) => {
            if (!props.disabled) {
              evt.preventDefault();
            }
          }}
          onDragEnter={(evt) => {
            if (!props.disabled) {
              evt.preventDefault();
              setIsDragging(true);
            }
          }}
          onDragLeave={(evt) => {
            if (!props.disabled) {
              evt.preventDefault();
              setIsDragging(false);
            }
          }}
        >
          <div className="text-nextadmin-content-inverted/50 dark:text-dark-nextadmin-content-inverted/50 text-center">
            <CloudArrowUpIcon className="mx-auto h-8 w-8" />
            <div className="mt-4 flex text-sm leading-6">
              <label
                htmlFor={props.id}
                className={clsx(
                  "text-nextadmin-primary-600 hover:text-nextadmin-primary-500 rounded-md font-semibold focus-visible:outline-none"
                )}
              >
                <span>{t("form.widgets.file_upload.label")}</span>
                <input
                  type="file"
                  className={clsx(
                    "absolute inset-0 h-full w-full opacity-0",
                    props.disabled
                      ? "point-event-none cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                  ref={inputRef}
                  id={props.id}
                  disabled={props.disabled}
                  required={props.required}
                  name={props.name}
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">
                {t("form.widgets.file_upload.drag_and_drop")}
              </p>
            </div>
          </div>
        </div>
      }
      {file && (
        <div
          className={clsx(
            "ring-nextadmin-border-default dark:ring-dark-nextadmin-border-default relative flex cursor-default items-center justify-between rounded-md px-3 px-8 py-2 text-sm placeholder-gray-500 shadow-sm ring-1"
          )}
        >
          <a
            href={fileData ?? undefined}
            className="relative flex flex-1 cursor-pointer flex-col items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fileIsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fileData!} alt="file" className="h-32" />
            ) : (
              <DocumentIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-10 w-10" />
            )}
            {file.name && file.name !== "undefined" && (
              <span className="text-nextadmin-content-inverted/50 dark:text-dark-nextadmin-content-inverted/50 text-sm">
                {file.name}
              </span>
            )}
          </a>
          {
            <div
              onClick={handleDelete}
              className={clsx(props.disabled && "hidden")}
            >
              <XMarkIcon className="absolute right-2 top-2 h-5 w-5 cursor-pointer text-gray-400" />
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default FileWidget;
