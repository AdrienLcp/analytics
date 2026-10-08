import { resolve } from 'node:path'

import optimizeLocales from '@react-aria/optimize-locales-plugin'
import react from '@vitejs/plugin-react'
import fontaine from 'fontaine/postcss'
import { defineConfig } from 'vite'
import { experimental_readRawConfig } from 'wrangler'

import { API_PREFIX } from '../../packages/protocol/src/routes.ts'
import { arialMetricTwins } from './arial-metric-twins.ts'
import { REGIONAL_LOCALES } from './src/presentation/i18n/regional-locales.ts'

/** Where `pnpm dev` at the root serves the Worker: the port `wrangler.jsonc` sets. */
const workerDevOrigin = (): string => {
  const { rawConfig } = experimental_readRawConfig({
    config: resolve(import.meta.dirname, '../api/wrangler.jsonc')
  })
  const port = rawConfig.dev?.port

  if (port === undefined) {
    throw new Error('apps/api/wrangler.jsonc sets no dev.port to proxy to')
  }

  return `http://localhost:${port}`
}

/**
 * Each face gets a fallback face of its own, a local font scaled to the same
 * metrics: text paints at once in it and keeps its place when the real face
 * swaps in.
 */
const metricMatchedFallbackFaces = fontaine({
  fallbacks: { 'Familjen Grotesk': ['Arial'], 'Geist Mono': ['Courier New'] },
  resolvePath: (path) => resolve(import.meta.dirname, 'public', `.${path}`)
})

/**
 * Built straight into the Worker's static assets, first and emptying the
 * folder: the tracker builds after it and adds `tracker.js` beside it.
 */
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: resolve(import.meta.dirname, '../api/public')
  },
  css: {
    postcss: { plugins: [metricMatchedFallbackFaces, arialMetricTwins] }
  },
  plugins: [
    react({ compiler: { logDiagnostics: true } }),
    {
      ...optimizeLocales.vite({ locales: Object.values(REGIONAL_LOCALES) }),
      enforce: 'pre'
    }
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src')
    }
  },
  server: {
    port: 5180,
    proxy: { [API_PREFIX]: workerDevOrigin() },
    strictPort: true
  }
})
