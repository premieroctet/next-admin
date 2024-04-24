"use client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type MessageProps = {
  message: string;
  type: "success" | "error" | "info";
};

const Message = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const searchParams = useSearchParams();
  const [type, setType] = useState<MessageProps["type"]>("info");
  const [message, setMessage] = useState<string | null>();
  useEffect(() => {
    if (searchParams.get("error")) {
      setType("error");
      setMessage(searchParams.get("error")!);
    } else if (searchParams.get("message")) {
      try {
        const messageObject = searchParams.get("message")
          ? JSON.parse(searchParams.get("message")!)
          : null;
        console.log(messageObject);
        if (messageObject?.type) {
          setType(messageObject.type);
        }
        if (messageObject?.content) {
          setMessage(messageObject.content);
        }
      } catch {
        setType("success");
        setMessage(searchParams.get("message")!);
      }
    } else {
      setMessage(null);
    }
  }, [searchParams]);

  return (
    message && (
      <div
        {...props}
        className={clsx(
          "rounded-md p-4",
          {
            "bg-nextadmin-alert-success-background dark:bg-dark-nextadmin-alert-success-background text-nextadmin-alert-success-content dark:text-dark-nextadmin-alert-success-content":
              type === "success",
            "bg-nextadmin-alert-error-background dark:bg-dark-nextadmin-alert-error-background text-nextadmin-alert-error-content dark:text-dark-nextadmin-alert-error-content":
              type === "error",
            "bg-nextadmin-alert-info-background dark:bg-dark-nextadmin-alert-info-background text-nextadmin-alert-info-content dark:text-dark-nextadmin-alert-info-content":
              type === "info",
          },
          props.className
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {type === "success" && (
              <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
            {type === "error" && (
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
            {type === "info" && (
              <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    )
  );
};
export default Message;
