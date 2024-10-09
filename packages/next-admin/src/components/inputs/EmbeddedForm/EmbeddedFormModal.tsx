import { Transition, TransitionChild } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UiSchema } from "@rjsf/utils";
import { Fragment, useEffect, useState } from "react";
import Loader from "../../../assets/icons/Loader";
import { useConfig } from "../../../context/ConfigContext";
import { useI18n } from "../../../context/I18nContext";
import ResourceProvider from "../../../context/ResourceContext";
import { Field, ModelName, SchemaModel } from "../../../types";
import { Form } from "../../Form";
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
}: {
  originalResource: O;
  resource: M;
  id?: string;
  onClose: () => void;
}) => {
  const { t } = useI18n();
  const { apiBasePath } = useConfig();

  const [resourceData, setResourceData] = useState<{
    data: FormData;
    modelSchema: SchemaModel<M>;
    uiSchema: UiSchema;
  } | null>(null);
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

      setResourceData({ data, modelSchema, uiSchema });
    };

    fetchData();
  }, [apiBasePath, id, resource]);

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
                    {t("Edit")} {resource}
                  </h2>
                  <div className="flex gap-4">
                    <DialogClose onClick={onClose}>
                      <XMarkIcon className="h-5 w-5" />
                    </DialogClose>
                    <DialogClose onClick={onClose}>
                      <div className="bg-nextadmin-brand-default text-nextadmin-brand-inverted hover:bg-nextadmin-brand-emphasis rounded-full p-1.5">
                        <CheckIcon className="h-5 w-5" />
                      </div>
                    </DialogClose>
                  </div>
                </div>
              </DialogTitle>

              <div className="flex flex-col gap-4 p-4 pt-4 sm:px-8 sm:pb-8">
                {resourceData ? (
                  <ResourceProvider
                    resource={resource}
                    modelSchema={resourceData.modelSchema}
                    uiSchema={resourceData.uiSchema}
                  >
                    <Form data={resourceData?.data as FormData} id={id} />
                  </ResourceProvider>
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
