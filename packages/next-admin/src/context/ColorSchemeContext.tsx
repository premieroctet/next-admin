"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BasicColorScheme, ColorScheme, colorSchemes } from "../types";
import { colorSchemeScript } from "../utils/colorSchemeScript";
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
  const { options } = useConfig();
  const getInitialColorScheme = (): ColorScheme => {
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
  };

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    getInitialColorScheme()
  );
  const [colorSchemeIcon, setColorSchemeIcon] = useState<
    JSX.Element | undefined
  >(() => {
    if (colorScheme !== "system") {
      return basicColorSchemeIcons[colorScheme];
    }
  });
  const [systemPreference, setSystemPreference] = useState<BasicColorScheme>();

  const applyColorScheme = useCallback(() => {
    document.documentElement.classList.remove("dark", "light");
    const colorSchemeValue: BasicColorScheme | undefined =
      colorScheme === "system" ? systemPreference : colorScheme;
    colorSchemeValue &&
      setColorSchemeIcon(basicColorSchemeIcons[colorSchemeValue]);
    colorSchemeValue &&
      document.documentElement.classList.add(colorSchemeValue);
  }, [colorScheme, systemPreference]);

  useEffect(() => {
    localStorage.setItem("next-admin-theme", colorScheme);
    applyColorScheme();
  }, [colorScheme, applyColorScheme]);

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
      <ColorSchemeScript
        {...{
          forceColorScheme: options?.forceColorScheme,
          defaultColorSchema: options?.defaultColorScheme,
        }}
      />
      {children}
    </ColorSchemeContext.Provider>
  );
};

const ColorSchemeScript = memo(
  ({
    forceColorScheme,
    defaultColorScheme,
  }: {
    forceColorScheme?: ColorScheme;
    defaultColorScheme?: ColorScheme;
  }) => {
    const scriptArgs = JSON.stringify([
      forceColorScheme,
      defaultColorScheme,
    ]).slice(1, -1);
    return (
      <script
        suppressHydrationWarning
        nonce={typeof window === "undefined" ? "nonce" : ""}
        dangerouslySetInnerHTML={{
          __html: `
          (${colorSchemeScript.toString()})(${scriptArgs});`,
        }}
      />
    );
  }
);

export const useColorScheme = () => {
  return useContext(ColorSchemeContext);
};
