import { CloudArrowUpIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "../../context/I18nContext";

const FileWidget = (props: WidgetProps) => {
  const [fileInfo, setFileInfo] = useState<number | null>(
    props.value ? props.value : null
  );
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileIsImage, setFileIsImage] = useState(false);
  const [fileImage, setFileImage] = useState<string | null>(props.value);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const { size } = file;
    setFileInfo(size);
    setFileName(file.name);

    if (file.type.includes("image")) {
      const reader = new FileReader();

      reader.onload = () => {
        setFileIsImage(true);
        setFileImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setFileImage(null);
      setFileIsImage(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const getFileType = () => {
    if (!props.value) {
      return;
    }

    try {
      const img = new Image();

      img.onload = () => {
        setFileIsImage(true);
        setFileImage(props.value);
      };

      img.onerror = () => {
        setFileIsImage(false);
        setFileImage(props.value);
      };

      img.src = props.value as string;
    } catch (error) {
      setFileIsImage(false);
    }
  };

  const onCheckDelete = (evt: ChangeEvent<HTMLInputElement>) => {
    setIsDeleting(evt.target.checked);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    getFileType();
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
          <div className="flex gap-4 items-end">
            <div className="relative flex flex-col items-center space-x-2 gap-1">
              <a
                href={isLink ? props.value : undefined}
                className="relative"
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileIsImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileImage!} alt="file" className="h-32" />
                ) : (
                  <DocumentIcon className="h-12 w-12 text-gray-400" />
                )}
              </a>
              {!!fileName && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {fileName}
                </span>
              )}
            </div>
            <div
              className={clsx("relative flex items-start", {
                "mb-5": !!fileName,
              })}
            >
              <div className="flex h-6 items-center">
                <input
                  id="delete_file"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-nextadmin-primary-600 focus:ring-nextadmin-primary-600"
                  onChange={onCheckDelete}
                />
              </div>
              <div className="ml-2 text-sm leading-6">
                <label
                  htmlFor="delete_file"
                  className="font-medium text-gray-900"
                >
                  {t("form.widgets.file_upload.delete")}
                </label>
              </div>
            </div>
          </div>
        )}
        <div
          className={clsx(
            "flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-full",
            {
              "bg-nextadmin-primary-200/20": isDragging,
            }
          )}
          onDrop={(evt) => {
            evt.preventDefault();
            const files = evt.dataTransfer.files;

            handleFileSelect(files[0]);
            setIsDragging(false);
          }}
          onDragOver={(evt) => {
            evt.preventDefault();
          }}
          onDragEnter={(evt) => {
            evt.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(evt) => {
            evt.preventDefault();
            setIsDragging(false);
          }}
        >
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-300" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor={props.id}
                className="relative cursor-pointer rounded-md font-semibold text-nextadmin-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-nextadmin-primary-600 focus-within:ring-offset-2 hover:text-nextadmin-primary-500"
              >
                <span>{t("form.widgets.file_upload.label")}</span>
                <input
                  type="file"
                  className="sr-only"
                  ref={inputRef}
                  id={props.id}
                  name={isDeleting || hasChanged ? props.name : ""}
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">
                {t("form.widgets.file_upload.drag_and_drop")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileWidget;
