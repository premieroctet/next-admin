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
        "invisible group-hover:visible w-5 transition-colors",
        copied ? "text-green-700" : "hover:text-indigo-500"
      )}
      onClick={(evt) => {
        evt.stopPropagation();
        copy(value);
      }}
    />
  );
};

export default Clipboard;
