import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  workers: 1,
  use: {
    viewport: { width: 1920, height: 1080 },
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["html", {}]],
});
