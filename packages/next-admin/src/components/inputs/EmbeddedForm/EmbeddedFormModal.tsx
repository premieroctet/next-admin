import { Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UiSchema } from "@rjsf/utils";
import { Fragment, useCallback, useEffect, useState } from "react";
import Loader from "../../../assets/icons/Loader";
import { ConfigProvider, useConfig } from "../../../context/ConfigContext";
import { useI18n } from "../../../context/I18nContext";
import { useMessage } from "../../../context/MessageContext";
import { ModelName, SchemaModel } from "../../../types";
import Form from "../../Form";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from "../../radix/Dialog";

const EmbeddedFormModal = <M extends ModelName, O extends ModelName>({
  originalResource,
  resource,
  id,
  parentId,
  onClose,
  onSuccess,
}: {
  originalResource: O;
  resource: M;
  id?: string;
  parentId?: string;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}) => {
  const { t } = useI18n();
  const { apiBasePath, basePath, resourcesIdProperty, schema, options, isAppDir } = useConfig();
  const { showMessage } = useMessage();
  const isCreateMode = !id;

  const [resourceData, setResourceData] = useState<{
    data: any;
    modelSchema: SchemaModel<M>;
    uiSchema: UiSchema;
    relationshipsRawData: any;
    resource: M;
  } | null>(null);

  // Helper function to find the field that relates to the parent resource
  const findParentRelationField = (modelSchema: SchemaModel<M>, parentResource: O) => {
    const properties = modelSchema.properties;

    for (const [fieldName, fieldSchema] of Object.entries(properties)) {
      if (typeof fieldSchema === 'object' && fieldSchema !== null && 'relation' in fieldSchema) {
        // Check if this field relates to the parent resource
        if (fieldSchema.relation === parentResource) {
          return fieldName;
        }
      }
    }

    return null;
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${apiBasePath}/${resource}/schema${id ? `/${id}` : ""}`
      );

      if (!response.ok) {
        const error = await response.json();
        showMessage({
          type: "error",
          message: error.error || "Failed to fetch resource data",
        });
        return;
      }

      const { data, modelSchema, uiSchema, relationshipsRawData, resource: resourceName } = await response.json();

      // Auto-fill parent relation field when creating new resource
      let modifiedData = data;
      let modifiedUiSchema = uiSchema;

      if (isCreateMode && parentId && originalResource) {
        // Find the field that relates to the original resource
        const parentFieldName = findParentRelationField(modelSchema, originalResource);

        if (parentFieldName) {
          // Auto-fill the parent relation field
          modifiedData = {
            ...data,
            [parentFieldName]: {
              value: parentId,
              label: `${originalResource} ${parentId}`, // This could be improved with actual parent data
            }
          };

          // Disable the parent relation field in UI schema
          modifiedUiSchema = {
            ...uiSchema,
            [parentFieldName]: {
              ...uiSchema[parentFieldName],
              "ui:disabled": true,
              "ui:help": t("form.embedded.parent_relation_locked"),
            }
          };
        }
      }

      setResourceData({
        data: modifiedData,
        modelSchema,
        uiSchema: modifiedUiSchema,
        relationshipsRawData,
        resource: resourceName,
      });
    };

    fetchData();
  }, [apiBasePath, id, resource, originalResource, isCreateMode, parentId, showMessage, t]);



  const handleFormSubmitCallback = useCallback((result: any) => {
    onClose();
    if (result.created || result.updated) {
      showMessage({
        type: "success",
        message: t("form.embedded.success"),
      });
    }
  }, [onClose, showMessage, t]);

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
              className="fixed inset-0"
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
              className="fixed inset-x-0 max-h-[90vh] max-w-screen-md overflow-y-auto p-0 md:left-[50%] md:top-[50%] bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis border-nextadmin-border-default dark:border-dark-nextadmin-border-default max-w-screen-md rounded-lg border"
            >
              <DialogTitle className="bg-nextadmin-background-default/90 dark:bg-dark-nextadmin-background-emphasis/90 shadow-b-md sticky inset-x-0 top-0 z-[53] p-4 sm:px-8">
                <div className="flex w-full justify-between">
                  <h2 className="text-xl font-bold">
                    {isCreateMode ? t("actions.create.label") : t("actions.edit.label")} {resource}
                  </h2>
                  <DialogClose onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                  </DialogClose>
                </div>
              </DialogTitle>
              {resourceData ? (
                <ConfigProvider
                  basePath={basePath}
                  apiBasePath={apiBasePath}
                  options={options}
                  resource={resource}
                  resourcesIdProperty={resourcesIdProperty}
                  schema={schema}
                  isAppDir={isAppDir}
                >
                  <Form
                    data={resourceData.data}
                    schema={resourceData.modelSchema}
                    resource={resource}
                    title={`${isCreateMode ? t("actions.create.label") : t("actions.edit.label")} ${resource}`}
                    resourcesIdProperty={resourcesIdProperty!}
                    slug={isCreateMode ? undefined : id}
                    validation={undefined}
                    customInputs={null}
                    actions={undefined}
                    icon={undefined}
                    clientActionsComponents={null}
                    relationshipsRawData={resourceData.relationshipsRawData}
                    onSubmitCallback={handleFormSubmitCallback}
                    isEmbedded
                  />
                </ConfigProvider>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-6 w-6 animate-spin" />
                </div>
              )}
            </DialogContent>
          </TransitionChild>
        </Transition>
      </DialogPortal>
    </DialogRoot>
  );
};

export default EmbeddedFormModal;
