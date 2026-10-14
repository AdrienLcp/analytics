import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*.test.ts', '**/__tests__/**', '**/*.d.ts'],
      include: [
        'apps/api/src/**/*.ts',
        'apps/dashboard/src/**/*.{ts,tsx}',
        'apps/tracker/src/**/*.ts',
        'packages/protocol/src/**/*.ts'
      ],
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary']
    },
    projects: ['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts']
  }
})
