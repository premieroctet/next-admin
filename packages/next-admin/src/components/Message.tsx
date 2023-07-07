import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

type MessageProps = {
  message: string;
  type: "success" | "error" | "info";
};

const Message = ({ message, type }: MessageProps) => {
  return (
    <div
      className={`rounded-md p-4 ${
        type === "success" ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm font-medium ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Message;
