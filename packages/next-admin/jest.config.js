module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/singleton.tsx"],
};
