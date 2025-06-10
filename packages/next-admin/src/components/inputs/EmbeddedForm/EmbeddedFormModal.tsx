import { Transition, TransitionChild } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UiSchema } from "@rjsf/utils";
import { Fragment, useCallback, useEffect, useState } from "react";
import Loader from "../../../assets/icons/Loader";
import { useConfig } from "../../../context/ConfigContext";
import { useI18n } from "../../../context/I18nContext";
import { useMessage } from "../../../context/MessageContext";
import { Field, ModelName, SchemaModel } from "../../../types";
import Form from "../../Form";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "../../radix/Dialog";

const EmbeddedFormModal = <M extends ModelName, O extends ModelName>({
  originalResource,
  resource,
  id,
  onClose,
  onSuccess,
}: {
  originalResource: O;
  resource: M;
  id?: string;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}) => {
  const { t } = useI18n();
  const { apiBasePath, resourcesIdProperty } = useConfig();
  const { showMessage } = useMessage();
  const isCreateMode = !id;

  const [resourceData, setResourceData] = useState<{
    data: FormData;
    modelSchema: SchemaModel<M>;
    uiSchema: UiSchema;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, modelSchema, uiSchema } = (await fetch(
        `${apiBasePath}/${resource}/${id ?? ""}`
      ).then((res) => res.json())) as {
        data: FormData;
        modelSchema: SchemaModel<M>;
        uiSchema: UiSchema;
      };

      uiSchema["ui:submitButtonOptions"] = {
        norender: true,
      };

      // Only disable fields that relate to the original resource when editing
      if (!isCreateMode) {
        const disabledFields = (
          Object.keys(modelSchema.properties) as Field<M>[]
        ).filter(
          (key) =>
            modelSchema.properties[key]?.items?.relation === originalResource ||
            modelSchema.properties[key]?.relation === originalResource
        );

        disabledFields.forEach((field) => {
          uiSchema[field as string] = {
            "ui:disabled": true,
          };
        });
      }

      setResourceData({ data, modelSchema, uiSchema });
    };

    fetchData();
  }, [apiBasePath, id, resource, originalResource, isCreateMode]);

  const handleSave = useCallback(async () => {
    if (!resourceData) return;

    try {
      setIsSubmitting(true);

      // Get form data from the form element
      const formElement = document.querySelector('#embedded-form form') as HTMLFormElement;
      if (!formElement) return;

      const formData = new FormData(formElement);

      const response = await fetch(
        `${apiBasePath}/${resource}${id ? `/${id}` : ""}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      if (result?.error) {
        showMessage({
          type: "error",
          message: t(result.error),
        });
        return;
      }

      if (result?.created && onSuccess) {
        onSuccess(result.data);
        showMessage({
          type: "success",
          message: t("form.create.succeed"),
        });
      } else if (result?.updated && onSuccess) {
        onSuccess(result.data);
        showMessage({
          type: "success",
          message: t("form.update.succeed"),
        });
      }

      if (result?.created || result?.updated) {
        onClose();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showMessage({
        type: "error",
        message: "An error occurred while saving",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [apiBasePath, resource, id, onSuccess, onClose, resourceData, showMessage, t]);

  return (
    <DialogRoot>
      <DialogPortal forceMount>
        <Transition show={true} as="div">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            leave="transition-opacity ease-in-out duration-300"
          >
            <DialogOverlay
              forceMount
              className="bg-nextadmin-background-default/70 dark:bg-dark-nextadmin-background-default/70 fixed inset-0"
            />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            leave="transition-opacity ease-in-out duration-300"
          >
            <DialogContent
              forceMount
              className="fixed inset-x-0 max-h-[90vh] max-w-screen-md overflow-y-auto p-0 md:left-[50%] md:top-[50%]"
            >
              <DialogTitle className="bg-nextadmin-background-default/90 dark:bg-dark-nextadmin-background-default/90 shadow-b-md sticky inset-x-0 top-0 z-[53] p-4 sm:px-8">
                <div className="flex w-full justify-between">
                  <h2 className="text-xl font-bold">
                    {isCreateMode ? t("actions.create.label") : t("actions.edit.label")} {resource}
                  </h2>
                  <div className="flex gap-4">
                    <DialogClose onClick={onClose}>
                      <XMarkIcon className="h-5 w-5" />
                    </DialogClose>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="bg-nextadmin-brand-default text-nextadmin-brand-inverted hover:bg-nextadmin-brand-emphasis rounded-full p-1.5 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </DialogTitle>

              <div className="flex flex-col gap-4 p-4 pt-4 sm:px-8 sm:pb-8">
                {resourceData ? (
                  <div id="embedded-form" className="relative">
                    <Form
                      data={resourceData.data}
                      schema={resourceData.modelSchema}
                      resource={resource}
                      title={`${isCreateMode ? t("actions.create.label") : t("actions.edit.label")} ${resource}`}
                      resourcesIdProperty={resourcesIdProperty!}
                    />
                    {isSubmitting && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-6 w-6 animate-spin dark:stroke-gray-300" />
                  </div>
                )}
              </div>
            </DialogContent>
          </TransitionChild>
        </Transition>
      </DialogPortal>
    </DialogRoot>
  );
};

export default EmbeddedFormModal;
