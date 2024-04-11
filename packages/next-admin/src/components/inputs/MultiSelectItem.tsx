import { XMarkIcon } from "@heroicons/react/24/outline";

const MultiSelectItem = ({ label, onRemoveClick }: any) => {
  return (
    <div
      className="py flex cursor-pointer items-center justify-center rounded-md border border-gray-300 px-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
        "
    >
      {label}
      <button
        type="button"
        className="ml-1 flex-shrink-0 text-gray-400 hover:text-gray-500"
        onMouseDown={onRemoveClick}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MultiSelectItem;
