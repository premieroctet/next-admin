// @ts-nocheck
export const colorSchemeScript = (forceColorScheme, defaultColorScheme) => {
  document.documentElement.classList.remove("dark", "light");
  if (forceColorScheme) {
    return forceColorScheme;
  }
  const storedColorScheme = localStorage.getItem("next-admin-theme");
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";

  const colorSchemeValue =
    (storedColorScheme === "system" ? systemPreference : storedColorScheme) ??
    defaultColorScheme ??
    "system";
  document.documentElement.classList.add(colorSchemeValue);
};
