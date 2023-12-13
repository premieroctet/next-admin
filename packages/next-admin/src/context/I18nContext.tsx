"use client";
import React, { PropsWithChildren, createContext } from "react";
import { Translations } from "../types";

type Props = {
  translations: Translations;
};

const I18nContext = createContext<{
  t: (key: string) => string;
}>({
  t: () => "",
});

export const I18nProvider = ({
  translations,
  children,
}: PropsWithChildren<Props>) => {
  const t = (key: string) => {
    const translation = translations[key];

    return translation ?? key;
  };

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => React.useContext(I18nContext);
