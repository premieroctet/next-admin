"use client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect } from "react";
import { useMessage } from "../context/MessageContext";

const Message = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { message, hideMessage } = useMessage();
  useEffect(() => {
    if (message) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hideMessage, message]);

  return (
    message && (
      <div
        {...props}
        className={clsx(
          "rounded-md p-4",
          {
            "bg-nextadmin-alert-success-background dark:bg-dark-nextadmin-alert-success-background text-nextadmin-alert-success-content dark:text-dark-nextadmin-alert-success-content":
              message.type === "success",
            "bg-nextadmin-alert-error-background dark:bg-dark-nextadmin-alert-error-background text-nextadmin-alert-error-content dark:text-dark-nextadmin-alert-error-content":
              message.type === "error",
            "bg-nextadmin-alert-info-background dark:bg-dark-nextadmin-alert-info-background text-nextadmin-alert-info-content dark:text-dark-nextadmin-alert-info-content":
              message.type === "info",
          },
          props.className
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {message.type === "success" && (
              <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
            {message.type === "error" && (
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
            {message.type === "info" && (
              <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message.message}</p>
          </div>
        </div>
      </div>
    )
  );
};
export default Message;
