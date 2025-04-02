import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "../../../context/I18nContext";
import FileItem from "./FileItem";

type Props = Pick<
  WidgetProps,
  "rawErrors" | "name" | "disabled" | "id" | "required" | "schema"
> & {
  value?: string | string[] | null;
};

const FileWidget = (props: Props) => {
  const errors = props.rawErrors;
  const [files, setFiles] = useState<Array<string | File>>(() => {
    if (!props.value) {
      return [];
    }

    if (typeof props.value === "string") {
      return [props.value];
    }

    return props.value;
  });
  const acceptsMultipleFiles = props.schema.type === "array";

  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {

      setFiles((old) => {
        if (!acceptsMultipleFiles) {
          return [selectedFiles[0]];
        }

        return [...old, ...Array.from(selectedFiles)];
      });
    }
  };

  const handleDelete = (index: number) => {
    const stateFiles = files;
    setFiles((old) => {
      if (!acceptsMultipleFiles) {
        return [];
      }
      const newFiles = [...old];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    if (!props.disabled) {
      event.preventDefault();


      setFiles((old) => {
        if (acceptsMultipleFiles) {
          return [...old, ...Array.from(event.dataTransfer.files)];
        }

        return [event.dataTransfer.files[0]];
      });

      setIsDragging(false);
    }
  };

  useEffect(() => {
    const dataTransfer = new DataTransfer();

    files.forEach((file) => {
      if (typeof file === "string") {
        return;
      }

      dataTransfer.items.add(file);
    });

    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  return (
    <div className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted relative flex flex-col items-start space-y-2">
      <div
        className={clsx(
          "border-nextadmin-border-default dark:border-dark-nextadmin-border-default hover:bg-nextadmin-background-subtle hover:dark:bg-dark-nextadmin-background-subtle relative flex w-full justify-center rounded-lg border-2 border-dashed px-6 py-10",
          {
            "bg-dark-nextadmin-background-subtle": isDragging,
            "opacity-50": props.disabled,
          }
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
          <div className="mt-4 flex flex-wrap justify-center text-sm leading-6">
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
                required={!acceptsMultipleFiles ? props.required : false}
                name={props.name}
                onChange={handleFileChange}
                multiple={acceptsMultipleFiles}
              />
            </label>
            <p className="pl-1">
              {t("form.widgets.file_upload.drag_and_drop")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => {
          return (
            <FileItem
              key={`${typeof file === "string" ? file : file.name}`}
              disabled={props.disabled ?? false}
              file={file}
              hasError={!!errors}
              onDelete={() => {
                handleDelete(index);
              }}
            />
          );
        })}
      </div>
      {errors && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {errors.join(", ")}
        </div>
      )}
    </div>
  );
};

export default FileWidget;
