import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^dto/(.*)$': '<rootDir>/src/dto/$1',
    '^use-cases/(.*)$': '<rootDir>/src/use-cases/$1',
    '^service/(.*)$': '<rootDir>/src/service/$1',
    '^controller/(.*)$': '<rootDir>/src/controller/$1',
    '^infra/(.*)$': '<rootDir>/infra/$1',
    '^prisma/(.*)$': '<rootDir>/prisma/$1'
  },
};

export default config;
