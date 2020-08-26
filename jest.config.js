module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './__tests__/tsconfig.json'
    }
  }
}
