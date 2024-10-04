import { Transition, TransitionChild } from "@headlessui/react";
import clsx from "clsx";
import { cloneElement, Fragment, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Loader from "../assets/icons/Loader";
import { useConfig } from "../context/ConfigContext";
import {
  ActionStyle,
  ClientAction,
  MessageData,
  Model,
  ModelName,
} from "../types";
import { slugify } from "../utils/tools";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from "./radix/Dialog";

type Props<M extends ModelName> = {
  resource: M;
  resourceIds: Array<string | number>;
  onClose: (message?: MessageData) => void;
  action: ClientAction<M> & {
    title: string;
    id: string;
    style?: ActionStyle;
  };
};

const ClientActionDialog = <M extends ModelName>({
  resource,
  resourceIds,
  onClose,
  action,
}: Props<M>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Array<Model<M>> | null>(null);
  const { apiBasePath } = useConfig();

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();

    params.set("ids", resourceIds.join(","));

    if (action.depth) {
      // Avoid negative depth
      params.set("depth", Math.max(1, action.depth).toString());
    }

    fetch(`${apiBasePath}/${slugify(resource)}/raw?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [resource, resourceIds]);

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
              className={twMerge(
                clsx(
                  "max-h-[90vh] max-w-screen-md max-w-xl overflow-y-auto outline-none md:left-[50%] md:top-[50%]",
                  action?.className
                )
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
                  resource,
                  resourceIds,
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
