import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type MessageProps = {
  message: string;
  type: "success" | "error" | "info";
};

const Message = ({ message, type }: MessageProps) => {
  return (
    <div
      className={clsx("rounded-md p-4", {
        "bg-green-100 border-green-300": type === "success",
        "bg-red-100 border-red-300": type === "error",
        "bg-blue-100 border-blue-300": type === "info",
      })}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-700" aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={clsx("text-sm font-medium", {
              "text-green-800": type === "success",
              "text-red-800": type === "error",
              "text-blue-800": type === "info",
            })}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Message;
