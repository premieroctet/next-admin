"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ColorSchemeContextType = {
  colorScheme: "dark" | "light" | "system";
  setColorScheme: (colorScheme: "dark" | "light" | "system") => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: "system",
  setColorScheme: () => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const ColorSchemeProvider = ({ children }: ProviderProps) => {
  const getSystemColorScheme = () => {
    if (typeof window === "undefined") return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getSystemColorScheme()
  );

  const setColorSchemeClass = (colorScheme: "dark" | "light") => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(colorScheme);
    setColorScheme(colorScheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setColorSchemeClass(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      const className = e.matches ? "dark" : "light";
      setColorSchemeClass(className);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme: (colorScheme) => {
          const className =
            colorScheme === "system" ? getSystemColorScheme() : colorScheme;
          setColorSchemeClass(className);
        },
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  return useContext(ColorSchemeContext);
};
