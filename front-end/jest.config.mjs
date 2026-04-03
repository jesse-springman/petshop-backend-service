import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};
export default createJestConfig(customJestConfig);
