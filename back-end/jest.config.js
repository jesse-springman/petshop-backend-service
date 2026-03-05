/** @type {import('jest').Config} */

const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },

  injectGlobals: true,
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
