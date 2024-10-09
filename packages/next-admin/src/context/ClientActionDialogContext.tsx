import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ClientActionDialog from "../components/ClientActionDialog";
import { useRouterInternal } from "../hooks/useRouterInternal";
import { ClientAction, MessageData, ModelName } from "../types";
import { useMessage } from "./MessageContext";

type ClientActionDialogParams<M extends ModelName> = {
  resource: M;
  resourceIds: Array<string | number>;
  action: ClientAction<M>;
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

  const { showMessage } = useMessage();
  const { router } = useRouterInternal();

  const onClose = (message?: MessageData) => {
    setIsOpen(false);
    router.refresh();
    if (message) {
      showMessage({
        type: message.type,
        message: message.message,
      });
    }
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
