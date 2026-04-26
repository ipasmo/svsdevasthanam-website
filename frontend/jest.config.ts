import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const jestConfig: Config = {
  displayName: "SVS Frontend",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.css$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg|ico)$": "<rootDir>/src/__tests__/__mocks__/fileMock.ts",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // Only collect coverage from files that are safe to run in jsdom (no Next.js
  // server-only APIs like cookies(), headers(), etc.).
  // Collecting from ALL src/** causes OOM and crashes because Next.js server
  // components import server-only modules incompatible with jsdom.
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "src/store/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__mocks__/**",
    "!src/**/__tests__/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text-summary", "lcov"],
  // No hard threshold — a failing threshold exits with code 1 and can crash
  // the VS Code Jest extension process. Enable once coverage is established.
  // coverageThreshold: { global: { lines: 70 } },

  // Limit parallel workers to avoid exhausting Node.js heap during coverage
  // instrumentation. Remove or increase when running on a CI server.
  maxWorkers: 2,
  forceExit: true,
};

export default createJestConfig(jestConfig);
