// @ts-check
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const jestConfig = {
  displayName: 'SVS Frontend',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg|ico)$': '<rootDir>/src/__tests__/__mocks__/fileMock.ts',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],

  // Only collect coverage from files safe in jsdom (no Next.js server-only APIs).
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],

  // Limit workers to avoid OOM during coverage instrumentation.
  maxWorkers: 2,
  forceExit: true,
};

module.exports = createJestConfig(jestConfig);
