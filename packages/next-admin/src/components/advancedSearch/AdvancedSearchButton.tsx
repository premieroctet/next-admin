import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useAdvancedSearch from "../../hooks/useAdvancedSearch";
import { ModelName, Schema } from "../../types";
import Button from "../radix/Button";
import AdvancedSearchModal from "./AdvancedSearchModal";

type Props = {
  resource: ModelName;
  schema: Schema;
};

const AdvancedSearchButton = ({ resource, schema }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { uiBlocks } = useAdvancedSearch({ resource, schema });

  return (
    <div className="relative">
      {uiBlocks?.length && (
        <span className="bg-nextadmin-brand-default absolute right-0 top-0 h-2 w-2 rounded-full" />
      )}
      <Button
        variant="ghost"
        className="px-2"
        onClick={() => setModalOpen(true)}
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </Button>
      <AdvancedSearchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        resource={resource}
        schema={schema}
      />
    </div>
  );
};

export default AdvancedSearchButton;
