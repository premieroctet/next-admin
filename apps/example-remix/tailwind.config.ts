import type { Config } from "tailwindcss";
import nextAdminPreset from "@premieroctet/next-admin/preset";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/examples-common/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nextAdminPreset],
} satisfies Config;
