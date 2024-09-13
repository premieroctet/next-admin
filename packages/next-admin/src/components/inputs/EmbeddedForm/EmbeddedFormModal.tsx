import { Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UiSchema } from "@rjsf/utils";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import { useI18n } from "../../../context/I18nContext";
import { ModelName, Schema } from "../../../types";
import { Form } from "../../Form";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "../../radix/Dialog";

const EmbeddedFormModal = ({
  resource,
  id,
  onClose,
}: {
  resource: ModelName;
  id: string;
  onClose: () => void;
}) => {
  const { t } = useI18n();
  const { apiBasePath } = useConfig();

  const [resourceData, setResourceData] = useState<{
    data: FormData;
    schema: Schema;
    uiSchema: UiSchema;
  } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data, schema, uiSchema } = await fetch(
        `${apiBasePath}/${resource}/${id}`
      ).then((res) => res.json());

      setResourceData({ data, schema, uiSchema });
    };

    fetchData();
  }, [apiBasePath, id, resource]);

  const { data, schema, uiSchema } = useMemo(() => {
    console.log("resourceData", resourceData);
    if (resourceData) {
      return resourceData;
    }

    return {
      data: null,
      schema: null,
      uiSchema: null,
    };
  }, [resourceData]);

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
              className="fixed inset-x-0 max-w-screen-md md:left-[50%] md:top-[50%]"
            >
              <div className="flex flex-col gap-4">
                <DialogTitle></DialogTitle>
                <div className="flex w-full justify-between p-4">
                  <h2 className="text-xl font-bold">
                    {t("Edit")} {resource}
                  </h2>
                  <DialogClose onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                  </DialogClose>
                </div>
                {schema && (
                  <Form
                    resource={resource}
                    data={data as FormData}
                    schema={schema as Schema}
                    uiSchema={uiSchema as UiSchema}
                  />
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
