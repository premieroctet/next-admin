import { XMarkIcon } from "@heroicons/react/24/outline";

const MultiSelectItem = ({ label, onRemoveClick }: any) => {
  return (
    <div
      className="flex items-center justify-center px-2 py text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 rounded-md border border-gray-300
        "
    >
      {label}
      <button
        type="button"
        className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-500"
        onMouseDown={onRemoveClick}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MultiSelectItem;
