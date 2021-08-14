module.exports = {
  testMatch: ['<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lodash-es$': 'lodash',
  },
  reporters: ['default', 'jest-junit'],
  setupFiles: ['<rootDir>/jest-setup.ts'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      babelConfig: true,
    },
  },
  testEnvironment: 'jsdom',
  resetMocks: true,
  restoreMocks: true,
}
