"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  MessageContextType,
  MessageData,
  MessageDataWithCustomComponent,
} from "../types";

const MessageContext = createContext<MessageContextType>({
  showMessage: () => {},
  message: null,
  hideMessage: () => {},
});

export const MessageProvider = ({ children }: PropsWithChildren) => {
  const { query } = useRouterInternal();

  const parseMessage = useCallback(() => {
    if (query.message) {
      try {
        /**
         * Hack to fix TanStack Start
         */
        const data = JSON.parse(
          query.message.replaceAll("\\", "").replaceAll(/(^")|("$)/g, "")
        );

        if (data.type && data.message) {
          return data;
        }

        return null;
      } catch {
        return null;
      }
    }

    return null;
  }, [query.message]);

  const [message, setMessage] = useState<MessageDataWithCustomComponent | null>(
    parseMessage
  );

  useEffect(() => {
    setMessage(parseMessage);
  }, [query.message]);

  const showMessage = (messageData: MessageData) => {
    setMessage(messageData);
  };

  const hideMessage = () => {
    setMessage(null);
  };

  return (
    <MessageContext.Provider value={{ showMessage, message, hideMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
