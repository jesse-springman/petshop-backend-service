import "@testing-library/jest-dom";
import { mockAnimationsApi } from "jsdom-testing-mocks";
// jest.setup.js
const originalError = console.error.bind(console); // ← bind para preservar contexto

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    if (typeof message === "string" && message.includes("not wrapped in act")) return;
    if (message instanceof Error && message.message.includes("Server error")) return;
    if (typeof message === "string" && message.includes("Server error")) return;
    originalError(message, ...args);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
