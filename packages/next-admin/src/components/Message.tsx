import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

type MessageProps = {
  message: string;
  type: "success" | "error" | "info";
};

const Message = ({ message, type }: MessageProps) => {
  return (
    <div
      className={clsx("rounded-md p-4", {
        "bg-nextadmin-alert-success-background dark:bg-dark-nextadmin-alert-success-background text-nextadmin-alert-success-content dark:text-dark-nextadmin-alert-success-content":
          type === "success",
        "bg-nextadmin-alert-error-background dark:bg-dark-nextadmin-alert-error-background text-nextadmin-alert-error-content dark:text-dark-nextadmin-alert-error-content":
          type === "error",
        "bg-nextadmin-alert-info-background dark:bg-dark-nextadmin-alert-info-background text-nextadmin-alert-info-content dark:text-dark-nextadmin-alert-info-content":
          type === "info",
      })}
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
  );
};
export default Message;
