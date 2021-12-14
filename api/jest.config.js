const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  roots: ['public/src'],
  testMatch: ['<rootDir>/public/src/**/?(*.)test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
    // '^.+\\.(ts|tsx)?$': 'ts-jest',
    // '^.+\\.(js|jsx)$': 'babel-jest',
  },
  verbose: true,
};
