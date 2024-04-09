import plugin from "tailwindcss/plugin";

type Options = {
  rootLight: string;
  rootDark: string;
};

const nextAdminPlugin = plugin.withOptions(
  (
    options: Options = {
      rootDark: "bg-slate-900",
      rootLight: "bg-slate-50/50",
    }
  ) => {
    return ({ addBase }) => {
      addBase({
        ".light .next-admin__root": {
          [`@apply ${options.rootLight}`]: "",
        },
        ".dark .next-admin__root": {
          [`@apply ${options.rootDark}`]: "",
        },
      });
    };
  }
);

export default nextAdminPlugin;
