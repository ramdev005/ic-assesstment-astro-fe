import "@testing-library/jest-dom";

// Mock environment variables
const mockEnv = {
  PUBLIC_API_URL: "http://localhost:3000/api/v1",
  PUBLIC_APP_NAME: "Shopping Cart",
  PUBLIC_APP_VERSION: "1.0.0",
};

// Mock import.meta.env for tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
  writable: true,
});

// Mock process.env as fallback
process.env = {
  ...process.env,
  ...mockEnv,
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location - skip to avoid JSDOM navigation errors
