import { Transition, TransitionChild } from "@headlessui/react";
import { cloneElement, Fragment } from "react";
import clsx from "clsx";
import { useClientDialog } from "../context/ClientDialogContext";
import { useConfig } from "../context/ConfigContext";
import {
  AdminComponentProps,
  ModelAction,
  ModelName,
  ServerAction,
} from "../types";
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from "./radix/Dialog";

type Props = {
  actionsMap: NonNullable<AdminComponentProps["actionsMap"]>;
};

const ClientActionDialog = ({ actionsMap }: Props) => {
  const { data, isOpen, onClose, clearData } = useClientDialog();
  const { options } = useConfig();

  const action = data?.resource
    ? (options?.model?.[data.resource]?.actions?.find(
        (action: ModelAction<ModelName>) =>
          action.id === data?.actionId &&
          "type" in action &&
          action.type === "dialog"
      ) as Exclude<ModelAction<ModelName>, ServerAction>)
    : null;

  if (isOpen && !action) {
    throw new Error("Action not found");
  }

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal
    >
      <DialogPortal forceMount>
        <Transition show={isOpen} as="div">
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
            afterLeave={clearData}
          >
            <DialogContent
              className={clsx(
                "max-w-xl md:left-[50%] md:top-[50%]",
                action?.className
              )}
              forceMount
            >
              {action &&
                actionsMap[action.id] &&
                data &&
                cloneElement(actionsMap[action.id], {
                  data: data.data,
                  resource: data.resource,
                  resourceId: data.resourceId,
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
