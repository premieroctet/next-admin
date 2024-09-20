import { Transition, TransitionChild } from "@headlessui/react";
import clsx from "clsx";
import { cloneElement, Fragment, useEffect, useState } from "react";
import Loader from "../assets/icons/Loader";
import { useConfig } from "../context/ConfigContext";
import { ActionStyle, ClientAction, Model, ModelName } from "../types";
import { slugify } from "../utils/tools";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from "./radix/Dialog";

type Props<M extends ModelName> = {
  resource: M;
  resourceId: string | number;
  onClose: () => void;
  action: ClientAction<M> & {
    title: string;
    id: string;
    style?: ActionStyle;
  };
};

const ClientActionDialog = <M extends ModelName>({
  resource,
  resourceId,
  onClose,
  action,
}: Props<M>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Model<M> | null>(null);
  const { apiBasePath } = useConfig();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${apiBasePath}/${slugify(resource)}/${resourceId}/raw`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [resource, resourceId]);

  return (
    <DialogRoot
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal
    >
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
            <DialogOverlay forceMount />
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
              className={clsx(
                "max-w-xl outline-none md:left-[50%] md:top-[50%]",
                action?.className
              )}
              forceMount
            >
              {isLoading && (
                <div className="flex items-center justify-center">
                  <Loader className="stroke-nextadmin-content-default dark:stroke-dark-nextadmin-content-default h-6 w-6 animate-spin dark:stroke-gray-300" />
                </div>
              )}
              {data &&
                cloneElement(action.component, {
                  data: data,
                  resource: resource,
                  resourceId: resourceId,
                  onClose,
                })}
            </DialogContent>
          </TransitionChild>
        </Transition>
      </DialogPortal>
    </DialogRoot>
  );
};

export default ClientActionDialog;
