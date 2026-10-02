import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

/**
 * Recreating the local D1 takes about a second on CI but over ten on Windows,
 * where workerd restarts slowly: the default 10 s fails the harness suites.
 */
const WORKER_HARNESS_HOOK_TIMEOUT_MS = 60_000

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src')
    }
  },
  test: {
    hookTimeout: WORKER_HARNESS_HOOK_TIMEOUT_MS,
    include: ['src/**/*.test.ts']
  }
})
