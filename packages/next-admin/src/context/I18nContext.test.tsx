import React from "react";
import { renderHook } from "@testing-library/react";
import { I18nProvider, useI18n } from "./I18nContext";

describe("i18n context", () => {
  it("should return the correct translation", () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider
          translations={{ hello: "bonjour", hello_name: "Hello {{name}}" }}
        >
          {children}
        </I18nProvider>
      ),
    });

    expect(result.current.t("hello")).toBe("bonjour");
    expect(result.current.t("hello_name", { name: "John" })).toBe("Hello John");
  });

  it("should return the translation without interpolation if non matching options are passed", () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider translations={{ hello: "Hello {{name}}" }}>
          {children}
        </I18nProvider>
      ),
    });

    expect(result.current.t("hello", { nickname: "John" })).toBe(
      "Hello {{name}}"
    );
  });

  it("should return the key if the translation is not found", () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider translations={{ hello: "bonjour" }}>
          {children}
        </I18nProvider>
      ),
    });

    expect(result.current.t("hello_world")).toBe("hello_world");
  });
});
