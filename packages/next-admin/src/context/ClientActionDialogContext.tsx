import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ClientActionDialog from "../components/ClientActionDialog";
import { ActionStyle, ClientAction, ModelName } from "../types";

type ClientActionDialogParams<M extends ModelName> = {
  resource: M;
  resourceId: string | number;
  action: ClientAction<M> & {
    title: string;
    id: string;
    style?: ActionStyle;
  };
};

type ClientDialogContextType = {
  open: <M extends ModelName>(data: ClientActionDialogParams<M>) => void;
};

const ClientActionDialogContext = createContext<ClientDialogContextType>(
  {} as ClientDialogContextType
);

const ClientActionDialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] =
    useState<ClientActionDialogParams<any> | null>(null);

  const onClose = () => {
    setIsOpen(false);
    clearData();
  };

  const open = useCallback(
    <M extends ModelName>(dialogParams: ClientActionDialogParams<M>) => {
      setIsOpen(true);
      setDialogData(dialogParams);
    },
    []
  );

  const clearData = () => {
    setDialogData(null);
  };

  const contextValue = useMemo(() => ({ open }), [open]);

  return (
    <ClientActionDialogContext.Provider value={contextValue}>
      {children}
      {isOpen && dialogData && (
        <ClientActionDialog {...dialogData} onClose={onClose} />
      )}
    </ClientActionDialogContext.Provider>
  );
};

export const useClientActionDialog = () =>
  useContext(ClientActionDialogContext);

export default ClientActionDialogProvider;
