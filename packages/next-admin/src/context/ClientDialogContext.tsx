import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
  AdminComponentProps,
  ListDataFieldValue,
  Model,
  ModelName,
} from "../types";

type ClientDialogData = {
  resource: ModelName;
  resourceId: string | number;
  actionId: string;
  data: Record<keyof Model<ModelName>, ListDataFieldValue>;
};

type ClientDialogContextType = {
  isOpen: boolean;
  onClose: () => void;
  open: (data: ClientDialogData) => void;
  data: ClientDialogData | null;
  clearData: () => void;
};

const ClientDialogContext = createContext<ClientDialogContextType>(
  {} as ClientDialogContextType
);

const ClientDialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] = useState<ClientDialogData | null>(null);

  const onClose = () => {
    setIsOpen(false);
  };

  const open = (data: ClientDialogData) => {
    setIsOpen(true);
    setDialogData(data);
  };

  const clearData = () => {
    setDialogData(null);
  };

  return (
    <ClientDialogContext.Provider
      value={{ isOpen, onClose, open, data: dialogData, clearData }}
    >
      {children}
    </ClientDialogContext.Provider>
  );
};

export const useClientDialog = () => useContext(ClientDialogContext);

export default ClientDialogProvider;
