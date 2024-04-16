"use client";
import { useColorScheme } from "../context/ColorSchemeContext";
import { useI18n } from "../context/I18nContext";

const ColorSchemeSwitch = () => {
  const { colorScheme, colorSchemeIcon, toggleColorScheme } = useColorScheme();
  const { t } = useI18n();

  return (
    <div
      onClick={toggleColorScheme}
      role="button"
      className="text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color hover:text-nextadmin-menu-emphasis hover:bg-nextadmin-menu-muted dark:hover:bg-dark-nextadmin-menu-muted flex cursor-pointer select-none flex-row items-center gap-5 rounded-lg p-3 text-sm font-medium transition-colors"
    >
      {colorSchemeIcon}
      <span className="min-w-[3.5rem]">{t(`theme.${colorScheme}`)}</span>
    </div>
  );
};

export default ColorSchemeSwitch;
