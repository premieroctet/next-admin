import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import clx from "clsx";
import { useClipboard } from "../../hooks/useClipboard";

type Props = {
  value: string;
};

const Clipboard = ({ value }: Props) => {
  const { copy, copied } = useClipboard();

  const Component = copied ? ClipboardDocumentCheckIcon : ClipboardDocumentIcon;

  return (
    <Component
      className={clx(
        "text-nextadmin-content-default dark:text-dark-nextadmin-content-default invisible w-5 cursor-pointer transition-colors group-hover:visible",
        copied
          ? "text-green-700 dark:text-green-500"
          : "hover:text-nextadmin-content-emphasis dark:hover:text-dark-nextadmin-content-emphasis"
      )}
      onClick={(evt) => {
        evt.stopPropagation();
        copy(value);
      }}
    />
  );
};

export default Clipboard;
