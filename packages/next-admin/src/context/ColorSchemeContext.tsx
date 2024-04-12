"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BasicColorScheme, ColorScheme, colorSchemes } from "../types";
import { useConfig } from "./ConfigContext";

const basicColorSchemeIcons: Record<BasicColorScheme, JSX.Element> = {
  light: <SunIcon className="h-4 w-4" />,
  dark: <MoonIcon className="h-4 w-4" />,
};

type ColorSchemeContextType = {
  colorScheme: ColorScheme;
  colorSchemeIcon: ReactNode;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: "system",
  colorSchemeIcon: undefined,
  setColorScheme: () => {},
  toggleColorScheme: () => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const ColorSchemeProvider = ({ children }: ProviderProps) => {
  const [colorSchemeIcon, setColorSchemeIcon] = useState<JSX.Element>();
  const { options } = useConfig();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (options?.forceColorScheme) {
      return options?.forceColorScheme;
    }
    let storedColorScheme: ColorScheme | null = null;
    try {
      storedColorScheme = localStorage.getItem(
        "next-admin-theme"
      ) as ColorScheme | null;
      return storedColorScheme && colorSchemes.includes(storedColorScheme)
        ? storedColorScheme
        : options?.defaultColorScheme || "system";
    } catch {
      return options?.defaultColorScheme || "system";
    }
  });
  const [systemPreference, setSystemPreference] = useState<BasicColorScheme>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const applyColorScheme = useCallback(() => {
    document.documentElement.classList.remove("dark", "light");
    const colorSchemeValue: BasicColorScheme =
      colorScheme === "system" ? systemPreference : colorScheme;
    setColorSchemeIcon(basicColorSchemeIcons[colorSchemeValue]);
    document.documentElement.classList.add(colorSchemeValue);
  }, [colorScheme, systemPreference]);

  useEffect(() => {
    localStorage.setItem("next-admin-theme", colorScheme);
    applyColorScheme();
  }, [colorScheme, applyColorScheme]);

  useEffect(() => {
    applyColorScheme();
  }, [applyColorScheme]);

  const toggleColorScheme = () => {
    const index = colorSchemes.indexOf(colorScheme);
    const nextIndex = (index + 1) % colorSchemes.length;
    setColorScheme(colorSchemes[nextIndex]);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreference(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      const className = e.matches ? "dark" : "light";
      setSystemPreference(className);
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
        colorSchemeIcon,
        setColorScheme,
        toggleColorScheme,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  return useContext(ColorSchemeContext);
};
