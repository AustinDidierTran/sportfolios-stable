const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js'],
  roots: ['api/'],
  testMatch: ['<rootDir>/api/**/?(*.)test.{ts,tsx}', '<rootDir>/api/**/?(*.)test.{js,jsx}', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(t|j)s?$': 'ts-jest',
    // '^.+\\.(ts|tsx)?$': 'ts-jest',
    // '^.+\\.(js|jsx)$': 'babel-jest',
  },
  verbose: true,
};
