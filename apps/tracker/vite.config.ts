import { resolve } from 'node:path'

import { defineConfig } from 'vite'

/**
 * Built straight into the API's static assets, next to the dashboard, which
 * builds first and empties the folder: the Worker serves the script from the
 * same origin that receives its beacons.
 */
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/tracker.ts'),
      fileName: () => 'tracker.js',
      formats: ['iife'],
      name: 'analyticsTracker'
    },
    outDir: resolve(import.meta.dirname, '../api/public')
  }
})
