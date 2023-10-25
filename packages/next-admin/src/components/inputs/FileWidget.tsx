import { WidgetProps } from "@rjsf/utils";
import clsx from "clsx";

const FileWidget = ({ ...props }: WidgetProps) => {

  return (
    <div className="relative">
      <div className="relative flex items-start py-1">
        <div className={clsx("flex items-center w-full shadow-sm ring-1 ring-gray-300 border-0 rounded-md hover:cursor-pointer")}>
          <input
            id={props.id}
            name={props.name}
            type="file"
            className={clsx(`w-full
          file:bg-indigo-50 file:text-indigo-500 file:text-base hover:file:bg-indigo-100 
          file:rounded-md file:rounded-tr-none file:rounded-br-none 
          file:px-4 file:py-2 file:mr-4 file:border-none 
          hover:cursor-pointer text-sm text-gray-900 placeholder-gray-500 focus:outline-none`)}
          />
        </div>
      </div>
    </div>
  );
};

export default FileWidget;
