"use client";
import React, { PropsWithChildren, createContext } from "react";
import { Translations } from "../types";

type Props = {
  translations: Translations;
};

const I18nContext = createContext<{
  t: (
    key: string,
    options?: { [key: string]: any },
    fallback?: string
  ) => string;
}>({
  t: () => "",
});

export const I18nProvider = ({
  translations,
  children,
}: PropsWithChildren<Props>) => {
  const t = (
    key: string,
    options?: { [key: string]: any },
    fallback?: string
  ) => {
    let translation = translations[key];

    if (options && translation) {
      Object.entries(options).forEach(([key, value]) => {
        translation = translation!.replace(`{{${key}}}`, value);
      });
    }

    return translation ?? fallback ?? key;
  };

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => React.useContext(I18nContext);
