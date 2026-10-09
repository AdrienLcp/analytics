import { resolve } from 'node:path'

import { metricTwins } from '@adrienlcp/styles/metric-twins'
import optimizeLocales from '@react-aria/optimize-locales-plugin'
import react from '@vitejs/plugin-react'
import fontaine from 'fontaine/postcss'
import { defineConfig } from 'vite'
import { experimental_readRawConfig } from 'wrangler'

import { API_PREFIX } from '../../packages/protocol/src/routes.ts'
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
 * swaps in. Familjen Grotesk's are written in `_fonts.sass` instead: its
 * tabular digits set narrower than its letters over Arial, and need a face of
 * their own.
 */
const metricMatchedFallbackFaces = fontaine({
  fallbacks: { 'Geist Mono': ['Courier New'] },
  resolvePath: (path) => resolve(import.meta.dirname, 'public', `.${path}`),
  skipFontFaceGeneration: (fallbackName) =>
    fallbackName === 'Familjen Grotesk fallback'
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
    postcss: { plugins: [metricMatchedFallbackFaces, metricTwins()] }
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
