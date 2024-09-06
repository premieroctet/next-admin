import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ModelName, Schema } from "../types";
import useAdvancedSearch from "../hooks/useAdvancedSearch";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resource: ModelName;
  schema: Schema;
};

const AdvancedSearchModal = ({ isOpen, onClose, resource, schema }: Props) => {
  return (
    <Dialog
      as="div"
      open={isOpen}
      className="relative z-50 transition duration-300 ease-in-out"
      onClose={onClose}
      transition
    >
      <DialogBackdrop
        transition
        className="z-999 bg-nextadmin-background-default/70 dark:bg-dark-nextadmin-background-default/70 fixed inset-0 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel
          className="bg-nextadmin-background-emphasis dark:bg-dark-nextadmin-background-emphasis w-full max-w-md rounded-xl p-4 shadow-sm duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          transition
        ></DialogPanel>
      </div>
    </Dialog>
  );
};

export default AdvancedSearchModal;
