"use client";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { BasicColorScheme, ColorScheme, colorSchemes } from "../types";

const basicColorSchemeIcons: Record<
  BasicColorScheme | "system",
  React.JSX.Element
> = {
  light: <SunIcon className="h-4 w-4" />,
  dark: <MoonIcon className="h-4 w-4" />,
  system: <ComputerDesktopIcon className="h-4 w-4" />,
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
  const { theme: colorScheme, setTheme: setColorScheme } = useTheme();

  const [colorSchemeIcon, setColorSchemeIcon] = useState<
    React.JSX.Element | undefined
  >(() => {
    return basicColorSchemeIcons[colorScheme!];
  });

  useEffect(() => {
    setColorSchemeIcon(basicColorSchemeIcons[colorScheme!]);
  }, [colorScheme]);

  const toggleColorScheme = () => {
    const index = colorSchemes.indexOf(colorScheme!);
    const nextIndex = (index + 1) % colorSchemes.length;
    setColorScheme(colorSchemes[nextIndex]);
  };

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme: colorScheme as ColorScheme,
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
