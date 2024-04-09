import { PresetsConfig } from "tailwindcss/types/config";
import defaultColors from "tailwindcss/colors";

const nextAdminPreset: PresetsConfig = {
  theme: {
    extend: {
      colors: {
        nextadmin: {
          primary: defaultColors.indigo,
          brand: {
            subtle: defaultColors.indigo[500],
            default: defaultColors.indigo[600],
            emphasis: defaultColors.indigo[700],
            inverted: defaultColors.white,
            muted: defaultColors.slate[100],
          },
          menu: {
            background: defaultColors.slate[50],
            color: defaultColors.slate[500],
            muted: defaultColors.indigo[100],
            emphasis: defaultColors.indigo[700],
          },
          border: {
            default: defaultColors.slate[200],
            strong: defaultColors.slate[300],
          },
          background: {
            default: defaultColors.white,
            subtle: defaultColors.slate[50],
            muted: defaultColors.slate[100],
            emphasis: defaultColors.slate[200],
          },
          content: {
            default: defaultColors.gray[400],
            subtle: defaultColors.neutral[600],
            emphasis: defaultColors.slate[500],
            inverted: defaultColors.gray[700],
          },
        },
        "dark-nextadmin": {
          primary: defaultColors.indigo,
          brand: {
            subtle: defaultColors.indigo[400],
            default: defaultColors.indigo[500],
            emphasis: defaultColors.indigo[700],
            inverted: defaultColors.white,
            muted: defaultColors.slate[50],
          },
          menu: {
            background: defaultColors.slate[800],
            color: defaultColors.slate[300],
            muted: defaultColors.slate[600],
            emphasis: defaultColors.slate[200],
          },
          border: {
            default: defaultColors.slate[600],
            strong: defaultColors.slate[700],
          },
          background: {
            default: defaultColors.slate[900],
            emphasis: defaultColors.slate[800],
            subtle: defaultColors.slate[600],
            muted: defaultColors.slate[500],
          },
          content: {
            default: defaultColors.gray[300],
            subtle: defaultColors.neutral[200],
            emphasis: defaultColors.slate[400],
            inverted: defaultColors.slate[50],
          },
        },
      },
    },
  },
  darkMode: "class",
};

export default nextAdminPreset;
