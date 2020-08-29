module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  transform: {
    // Svelte components are tested in Cypress
    '^.+.svelte$': 'jest-transform-stub'
  },
  globals: {
    'ts-jest': {
      tsConfig: './__tests__/tsconfig.json'
    }
  }
}
