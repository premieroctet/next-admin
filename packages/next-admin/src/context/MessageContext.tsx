"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useRouterInternal } from "../hooks/useRouterInternal";

type MessageData = {
  type: "error" | "info" | "success";
  message: string;
};

type MessageContextType = {
  showMessage: (message: MessageData) => void;
  message: MessageData | null;
  hideMessage: () => void;
};

const MessageContext = createContext<MessageContextType>({
  showMessage: () => {},
  message: null,
  hideMessage: () => {},
});

export const MessageProvider = ({ children }: PropsWithChildren) => {
  const { query } = useRouterInternal();
  const [message, setMessage] = useState<MessageData | null>(() => {
    if (query.message) {
      try {
        const data = JSON.parse(query.message);

        if (data.type && data.message) {
          return data;
        }

        return null;
      } catch {
        return null;
      }
    }

    return null;
  });

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
